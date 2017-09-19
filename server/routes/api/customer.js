const express = require('express');
const customerRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
const {Messages} = require('../../messages');

customerRouter.post('/setup', [checkAPIKey, checkBody], (req, res, next) => {

  if (!req.body['first name']) return res.status(400).send('Bad request: No first name');

  if (!req.body['last name']) return res.status(400).send('Bad request: No last name');

  Customer.findOne(
    {messenger_user_id: req.body['messenger user id']}
  )
  .then((customer) => {
    if (!customer) {
      let newCustomer = new Customer({
          messenger_user_id: req.body['messenger user id'],
          first_name: req.body['first name'],
          last_name: req.body['last name']
      });
      newCustomer.save()
      .then(() => {
        res.status(200).send({
          "messages": [
             {
               "text": Messages.dual_lang.setupcustomer_greeting,
             }
          ],
          "redirect_to_blocks": ["Initiate Conversation"]
        })
      }).catch((err) => next(err));
    }
    else {
      Customer.findOneAndUpdate(
        {messenger_user_id: req.body['messenger user id']},
        {$set:
          {
            first_name: req.body['first name'],
            last_name: req.body['last name']
          }
        },
        {new: true} //this is for findOneAndUpdate to return the updated object
      )
      .then((customer) => {
        if(!customer.locale) {
          res.status(200).send({
            "messages": [
               {
                 "text": Messages.dual_lang.setupcustomer_greeting,
               }
            ],
            "redirect_to_blocks": ["Initiate Conversation"]
          })
        }
        else {
          res.status(200).send({
            "messages": [
              {
                "text": Messages[customer.locale].setupcustomer_greeting
              }
            ],
            "set_attributes": {
                "language": customer.locale,
            },
            "redirect_to_blocks": ["Initiate Conversation"]
          })
        }
      }).catch((err) => next(err));
    }
  })
  .catch((err) => next(err));
});

module.exports =  customerRouter;
