const express = require('express');
const phoneRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
const {Messages} = require('../../messages');

phoneRouter.post('/check', [checkAPIKey, checkBody], (req, res, next) => {
  Customer.findOne(
    {messenger_user_id: req.body['messenger user id']}
  )
  .then((customer) => {
    if (!customer) {
      res.status(404).send('Cannot find customer on the system.' +
                            'Make sure there is one created at Welcome Block');
      return;
    }

    if (!customer.phone_number) {
      res.status(200).send({
        "redirect_to_blocks": ["Get Customer Phone"]
      });
    }
    else {
      res.status(200).send({
        "messages": [
          {
            "text": Messages[customer.locale].checkphone(customer.phone_number),
            "quick_replies": [
              {
                "block_names": ["Get Customer Phone"],
                "title": Messages[customer.locale].checkphone_button_change
              },
              {
                "block_names": ["Finish Customer Phone"],
                "title": Messages[customer.locale].checkphone_button_no
              }
            ]
          }
        ],
        "set_attributes": {
          "phone number": customer.phone_number
        }
      });
    }
  })
  .catch((err) => next(err));
})

phoneRouter.post('/set', [checkAPIKey, checkBody], (req, res, next) => {

  if (!req.body['phone number']) {
    res.status(400).send('Bad request: No phone number.');
    return;
  }

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then((customer) => {

    res.status(200).send({
      "messages": [
        {
          "text": Messages[customer.locale].updatephone(customer.phone_number),
          "quick_replies": [
            {
              "block_names": ["Finish Customer Phone"],
              "title": Messages[customer.locale].setphone_button_correct
            },
            {
              "block_names": ["Get Customer Phone"],
              "title": Messages[customer.locale].checkphone_button_change
            },
          ]
        }
      ],
      "set_attributes": {
        "phone number": customer.phone_number
      }
    })
  })
  .catch((err) => next(err));
});


module.exports = phoneRouter;
