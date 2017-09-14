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
  if (!req.body['appointment fallback email']) {
    res.status(400).send('Bad request: No appointment fall back email');
    return;
  }
  if (!req.body['appointment open time']) {
    res.status(400).send('Bad request: No appointment open time');
    return;
  }
  if (!req.body['appointment close time']) {
    res.status(400).send('Bad request: No appointment close time');
    return;
  }
  if (!req.body['appointment fallback block']) {
    res.status(400).send('Bad request: No appointment fall back block');
    return;
  }
  if (!req.body['timezone']) {
    res.status(400).send('Bad request: No timezone');
    return;
  }
  if (!req.body['appointment duration']) {
    res.status(400).send('Bad request: No appointment duration');
    return;
  }

  let appointmentP =  AppointmentSetting.findOne({
    email: req.body['appointment fallback email']
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.body['messenger user id']
  });

  Promise.all([appointmentP, customerP])
  .then( ([appointmentSetting, customer]) => {
    if (!appointmentSetting) {
      let newAppointmentSetting = new AppointmentSetting({
          email: req.body['appointment fallback email'],
          open_time:req.body['appointment open time'],
          close_time:req.body['appointment close time'],
          timezone:req.body['timezone'],
          duration: req.body['appointment duration'],
          fallback_block:req.body['appointment fallback block']
      });
      newAppointmentSetting.save()
        .then(() => {
          res.status(200).send({
            "messages": [
              {
                "attachment": {
                  "type": "template",
                  "payload":{
                    "template_type": "button",
                    "text": Messages[customer.locale].appointmentSettingReady,
                    "buttons": [
                      {
                        "type": "show_block",
                        "block_names":  ["Get and Set Date"],
                        "title": Messages[customer.locale].appointment_button_start
                      },
                      {
                        "url": `https://${req.hostname}/api/appointment/cancel?token=${req.query.token}&user_id=${customer.messenger_user_id}`,
                        "type": "json_plugin_url",
                        "title": Messages[customer.locale].appointment_button_cancel
                      }
                    ]
                  }
                }
              }
            ]
          })
        }).catch((err) => next(err));
    } else {
      AppointmentSetting.findOneAndUpdate(
        {email: appointmentSetting.email},
        {$set: {
          email: req.body['appointment fallback email'],
          open_time: req.body['appointment open time'],
          close_time: req.body['appointment close time'],
          timezone:req.body['timezone'],
          duration: req.body['appointment duration'],
          fallback_block:req.body['appointment fallback block']
        }}
      )
      .then(() => {
        res.status(200).send({
          "messages": [
            {
              "attachment": {
                "type": "template",
                "payload":{
                  "template_type": "button",
                  "text": Messages[customer.locale].appointmentSettingReady,
                  "buttons": [
                    {
                      "type": "show_block",
                      "block_names":  ["Get and Set Date"],
                      "title": Messages[customer.locale].appointment_button_start
                    },
                    {
                      "url": `https://${req.hostname}/api/appointment/cancel?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}`,
                      "type": "json_plugin_url",
                      "title": Messages[customer.locale].appointment_button_cancel
                    }
                  ]
                }
              }
            }
          ]
        })
      }).catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
})

appointmentRouter.post('/cancel', [checkAPIKey, checkParam], (req, res, next) => {
  Customer.findOne({messenger_user_id: req.query.user_id})
  .then((customer) => {
    res.status(200).send({
      "messages": [
        {"text": Messages[customer.locale].appointment_cancel}
      ]
    })
  })
  .catch((err) => next(err));
});

appointmentRouter.post('/getdate', [checkAPIKey, checkParam], (req, res, next) => {
  if (!req.query.appointment_email) {
    res.status(400).send('Bad request: No appointment email');
    return;
  }

  let appointmentP =  AppointmentSetting.findOne({
    email: req.query.appointment_email
  });

  let customerP = Customer.findOne({
    messenger_user_id: req.query.fb_user_id
  });

  //Need to find the appointment settings using email. Supposed to be the only one in client database.
  Promise.all([appointmentP, customerP])
    .then(([appointmentSetting, customer]) => {
      let result = getAvailableDate(moment().format('DD/MM/YY'), appointmentSetting.timezone, 11);
      let dateOptions = result.map((dateString) => {
        const date = moment.unix(dateString);
        return {
          "url": `https://${req.hostname}/api/appointment/setdate?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${req.query.appointment_email}&date=${date.unix()}`,
          "type": "json_plugin_url",
          "title": date.format('ddd D')
        }
      })
      resObj = {
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
      "redirect_to_blocks": ["Get And Set Time"]
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
    email: req.query.appointment_email
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
        appointmentSetting.open_time,
        appointmentSetting.close_time,
        appointmentSetting.duration,
        appointmentSetting.timezone
      );
      let timeOptions = result.map((dateString) => {
        const time = moment.unix(dateString);
        return {
          "url": `https://${req.hostname}/api/appointment/settime?token=${req.query.token}&fb_user_id=${customer.messenger_user_id}&appointment_email=${req.query.appointment_email}&time=${time.unix()}`,
          "type": "json_plugin_url",
          "title": time.format('hh:mm')
        }
      })
      resObj = {
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
  console.log(time.format('DD/MM/YY hh:mm'));

  Customer.findOneAndUpdate(
    {messenger_user_id: req.query.fb_user_id},
    {$set: {appointment: time.unix()}},
    {new: true}
  )
  .then((customer) => {
    res.status(200).send({
      "messages" : [
        {"text": Messages[customer.locale].appointment_confirm(time.format('DD/MM/YY'), time.format('hh:mm'))}
      ],
      "redirect_to_blocks": ["Done Set Time"]
    })
  })
  .catch((err)=> next(err));
})


module.exports = appointmentRouter;
