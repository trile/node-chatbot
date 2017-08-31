const express = require('express');
const appointmentRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody} = require('../../middlewares/check-fbuser');

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
          fallback_block:req.body['appointment fallback block']
      });
      newAppointmentSetting.save()
        .then(() => {
          res.status(200).send({
            "messages": [
              {
                "text": Messages[customer.locale].appointmentSettingReady
              }
            ]
          })
        }).catch((err) => next(err));
    } else {
      res.status(200).send({
        "messages": [
          {
            "text": Messages[customer.locale].appointmentSettingReady
          }
        ]
      })
    }
  })
  .catch((err) => next(err));
})

module.exports = appointmentRouter;