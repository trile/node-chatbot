const moment = require('moment');
const express = require('express');
const appointmentRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody, checkParam} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
let {AppointmentSetting} = require('../../models/appointment_setting');
const {Messages} = require('../../messages');

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
                        "url": `https://${req.hostname}/api/appointment/getdate?token=${req.query.token}&user_id=${customer.messenger_user_id}&appointment_email=${req.body['appointment fallback email']}`,
                        "type": "json_plugin_url",
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
                      "url": `https://${req.hostname}/api/appointment/getdate?token=${req.query.token}&user_id=${customer.messenger_user_id}&appointment_email=${req.body['appointment fallback email']}`,
                      "type": "json_plugin_url",
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
  AppointmentSetting.findOne({email: req.query.appointment_email})
    .then((appointmentSetting) => {
      // console.log(appointmentSetting.timezone);
      res.status(200).send({OK})
    })
    .catch((err)=> next(err));
})


module.exports = appointmentRouter;
