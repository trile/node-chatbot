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
        "redirect_to_blocks": ["Add Customer Phone"]
      });
    }
    else {
      res.status(200).send({
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": Messages[customer.locale].checkphone(customer.phone_number),
                "buttons": [
                  {
                    "type": "show_block",
                    "block_name": "Update Customer Phone",
                    "title": Messages[customer.locale].checkphone_button_change
                  },
                  {
                    "type": "show_block",
                    "block_name": "Finish Customer Phone",
                    "title": Messages[customer.locale].checkphone_button_no
                  }
                ]
              }
            }
          }
        ]
      });
    }
  })
  .catch((err) => next(err));
})

phoneRouter.post('/add', [checkAPIKey, checkBody], (req, res, next) => {

  if (!req.body['phone number']) {
    res.status(400).send('Bad request: No phone number.');
    return;
  }

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then((customer)=> {
    if (!customer) {
      res.status(404).send('Cannot find customer on the system.' +
                            'Make sure there is one created at Welcome Block');
      return;
    }

    res.status(200).send({
      "messages": [
         {"text": Messages[customer.locale].addphone}
      ],
      "set_attributes": {
        "phone number": customer.phone_number
      }
    })
  })
  .catch((err) => next(err));
});

phoneRouter.post('/update', [checkAPIKey, checkBody], (req, res, next) => {

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
    if (!customer) {
      res.status(404).send('Cannot find customer on the system.' +
                            'Make sure there is one created at Welcome Block');
      return;
    }

    res.status(200).send({
      "messages": [
        {"text": Messages[customer.locale].updatephone(customer.phone_number)}
      ],
      "set_attributes": {
        "phone number": customer.phone_number
      }
    })
  })
  .catch((err) => next(err));
});


module.exports = phoneRouter;
