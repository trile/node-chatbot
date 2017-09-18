const moment = require('moment');
const express = require('express');
const appointmentRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody, checkParam} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
let {AppointmentSetting} = require('../../models/appointment_setting');
const {Messages} = require('../../messages');
const {getAvailableDate, getAvailableTime} = require('../../lib/time');

appointmentRouter.post('/setup', [checkAPIKey, checkBody], (req, res, next) => {

  if (!req.body['client email']) return res.status(400).send('Bad request: No client email');

  if (!req.body['open morning']) return res.status(400).send('Bad request: No morning open time');

  if (!req.body['close morning']) return res.status(400).send('Bad request: No morning close time');

  if (!req.body['open afternoon']) return res.status(400).send('Bad request: No afternoon open time');

  if (!req.body['close afternoon']) return res.status(400).send('Bad request: No afternoon close time');

  if (!req.body['open evening']) return res.status(400).send('Bad request: No evening open time');

  if (!req.body['close evening']) return res.status(400).send('Bad request: No evening close time');

  if (!req.body['timezone']) return res.status(400).send('Bad request: No timezone');

  if (!req.body['duration']) return res.status(400).send('Bad request: No appointment duration');

  if (!req.body['days off']) return res.status(400).send('Bad request: No days off setting');

  if (!req.body['holidays']) return res.status(400).send('Bad request: No holidays setting');


  let appointmentP =  AppointmentSetting.findOne({
    client_email: req.body['client email']
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.body['messenger user id']
  });

  Promise.all([appointmentP, customerP])
  .then( ([appointmentSetting, customer]) => {
    if (!appointmentSetting) {
      let newAppointmentSetting = new AppointmentSetting({
          client_email: req.body['client email'],
          open_morning:req.body['open morning'],
          close_morning:req.body['close morning'],
          open_afternoon:req.body['open afternoon'],
          close_afternoon:req.body['close afternoon'],
          open_evening:req.body['open evening'],
          close_evening:req.body['close evening'],
          timezone:req.body['timezone'],
          duration: req.body['duration'],
          days_off: req.body['days off'].replace(/\s/g,'').toLowerCase(),
          holidays: req.body['holidays'].replace(/\s/g,'')
      });
      newAppointmentSetting.save()
        .then(() => {
          res.status(200).send({
            "messages": [
              {
                "text":  Messages[customer.locale].appointmentSettingReady,
                "quick_replies": [
                  {
                    "title":Messages[customer.locale].appointment_button_start,
                    "block_names": ["Get and Set Date"]
                  },
                  {
                    "title":Messages[customer.locale].appointment_button_cancel,
                    "block_names": ["Cancel Appointment Booking"]
                  }
                ]
              }
            ]
          })
        }).catch((err) => next(err));
    } else {
      AppointmentSetting.findOneAndUpdate(
        {email: appointmentSetting.email},
        {$set: {
          client_email: req.body['client email'],
          open_morning:req.body['open morning'],
          close_morning:req.body['close morning'],
          open_afternoon:req.body['open afternoon'],
          close_afternoon:req.body['close afternoon'],
          open_evening:req.body['open evening'],
          close_evening:req.body['close evening'],
          timezone:req.body['timezone'],
          duration: req.body['duration'],
          days_off: req.body['days off'].replace(/\s/g,'').toLowerCase(),
          holidays: req.body['holidays'].replace(/\s/g,'')
        }}
      )
      .then(() => {
        res.status(200).send({
          "messages": [
            {
              "text":  Messages[customer.locale].appointmentSettingReady,
              "quick_replies": [
                {
                  "title":Messages[customer.locale].appointment_button_start,
                  "block_names": ["Get and Set Date"]
                },
                {
                  "title":Messages[customer.locale].appointment_button_cancel,
                  "block_names": ["Cancel Appointment Booking"]
                }
              ]
            }
          ]
        })
      }).catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
})

appointmentRouter.post('/getdate', [checkAPIKey, checkBody], (req, res, next) => {
  if (!req.body['client email']) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  let appointmentP =  AppointmentSetting.findOne({
    client_email: req.body['client email']
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.body['messenger user id']
  });

  //Need to find the appointment settings using email. Supposed to be the only one in client database.
  Promise.all([appointmentP, customerP])
    .then(([appointmentSetting, customer]) => {
      let result = getAvailableDate(
          moment().format('DD/MM/YY'),
          appointmentSetting.timezone,
          9,
          appointmentSetting.days_off,
          appointmentSetting.holidays
        );
      let dateOptions = result.map((dateString) => {
        const date = moment.unix(dateString);
        return {
          "url": `https://${req.hostname}/api/appointment/setdate?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${appointmentSetting.client_email}&date=${date.unix()}`,
          "type": "json_plugin_url",
          "title": `${Messages[customer.locale].dayOfWeek[date.day()]} ${date.format('D')}`
        }
      })
      let resObj = {
        "messages": [
          {
            "text":  Messages[customer.locale].get_appointment_date,
            "quick_replies": dateOptions
          }
        ]
      }
      res.status(200).send(JSON.stringify(resObj));

    })
    .catch((err)=> next(err));
})

appointmentRouter.post('/setdate', [checkAPIKey, checkParam], (req, res, next) => {
  if (!req.query.appointment_email) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  if(!req.query.date) {
    res.status(400).send('Bad request: No date');
    return;
  }

  const date = moment.unix(req.query.date);
  Customer.findOneAndUpdate(
    {messenger_user_id: req.query.fb_user_id},
    {$set: {appointment: date.unix()}},
    {new: true}
  )
  .then((customer) => {
    res.status(200).send({
      "set_attributes": {
          "date appointment": date.format('DD/MM/YY'),
      },
      "redirect_to_blocks": ["Get and Set Time"]
    })
  })
  .catch((err)=> next(err));
})

appointmentRouter.post('/getdaypart', [checkAPIKey, checkBody], (req, res, next) => {
  if (!req.body['client email']) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  let appointmentP =  AppointmentSetting.findOne({
    client_email: req.body['client email']
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.body['messenger user id']
  });

  Promise.all([appointmentP, customerP])
    .then(([appointmentSetting, customer]) => {
      let replyText = Messages[customer.locale].get_appointment_part_of_day;
      let quickReplyOptions = [];
      if (appointmentSetting.open_morning !== 'null') {
        replyText += '\n' + Messages[customer.locale].schedule_morning(appointmentSetting.open_morning, appointmentSetting.close_morning);
        quickReplyOptions.push({
          "title": Messages[customer.locale].morning,
          "type": "json_plugin_url",
          "url": `https://${req.hostname}/api/appointment/gettime?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${appointmentSetting.client_email}&daypart=morning`,
        })
      }
      if (appointmentSetting.open_afternoon !== 'null') {
        replyText += '\n' + Messages[customer.locale].schedule_afternoon(appointmentSetting.open_afternoon, appointmentSetting.close_afternoon);
        quickReplyOptions.push({
          "title": Messages[customer.locale].afternoon,
          "type": "json_plugin_url",
          "url": `https://${req.hostname}/api/appointment/gettime?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${appointmentSetting.client_email}&daypart=afternoon`,
        })
      }
      if (appointmentSetting.open_evening !== 'null') {
        replyText += '\n' + Messages[customer.locale].schedule_evening(appointmentSetting.open_evening, appointmentSetting.close_evening);
        quickReplyOptions.push({
          "title": Messages[customer.locale].evening,
          "type": "json_plugin_url",
          "url": `https://${req.hostname}/api/appointment/gettime?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${appointmentSetting.client_email}&daypart=evening`,
        })
      }

      res.status(200).send({
        "messages": [
          {
            "text":  replyText,
            "quick_replies": quickReplyOptions
          }
        ]
      })
    })
    .catch((err)=> next(err));
})

appointmentRouter.post('/gettime', [checkAPIKey, checkParam], (req, res, next) => {
  if (!req.query.appointment_email) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  let appointmentP =  AppointmentSetting.findOne({
    client_email: req.query.appointment_email
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.query.fb_user_id
  });

  //Need to find the appointment settings using email. Supposed to be the only one in client database.
  Promise.all([appointmentP, customerP])
    .then(([appointmentSetting, customer]) => {
      if (!customer.appointment) {
        res.status(500).send('Internal error: Appointment date for customer is not set');
      }

      //getAvailabeTime(dateString, startTimeStr, endTimeStr, intervalMinute, timezone, startBreakStr, endBreakStr)
      let result = getAvailableTime(
        moment.unix(customer.appointment).format('DD/MM/YY'),
        appointmentSetting['open_'+req.query.daypart],
        appointmentSetting['close_'+req.query.daypart],
        appointmentSetting.duration,
        appointmentSetting.timezone
      );
      let timeOptions = result.map((dateString) => {
        const time = moment.unix(dateString);
        return {
          "url": `https://${req.hostname}/api/appointment/settime?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${req.query.appointment_email}&time=${time.unix()}`,
          "type": "json_plugin_url",
          "title": time.format('HH:mm')
        }
      })

      let resObj = {
        "messages": [
          {
            "text":  Messages[customer.locale].get_appointment_time,
            "quick_replies": timeOptions
          }
        ]
      }

      res.status(200).send(JSON.stringify(resObj));

    })
    .catch((err)=> next(err));
})

appointmentRouter.post('/settime', [checkAPIKey, checkParam], (req, res, next) => {
  if (!req.query.appointment_email) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  if(!req.query.time) {
    res.status(400).send('Bad request: No time');
    return;
  }


  const time = moment.unix(req.query.time);

  Customer.findOneAndUpdate(
    {messenger_user_id: req.query.fb_user_id},
    {$set: {appointment: time.unix()}},
    {new: true}
  )
  .then((customer) => {
    res.status(200).send({
      "messages" : [
        {
          "text": Messages[customer.locale].appointment_verify(time.format('DD/MM/YY'), time.format('HH:mm')),
          "quick_replies": [
            {
              "title":Messages[customer.locale].appointment_button_confirm,
              "block_names": ["Finish Appointment Booking"]
            },
            {
              "title":Messages[customer.locale].appointment_button_change,
              "block_names": ["Setup Appointment Settings"]
            },
            {
              "title":Messages[customer.locale].appointment_button_cancel,
              "block_names": ["Cancel Appointment Booking"]
            }
          ]
        }
      ],
      "set_attributes": {
        "hour appointment": time.format('HH:mm'),
      }
    })
  })
  .catch((err)=> next(err));
})


module.exports = appointmentRouter;
