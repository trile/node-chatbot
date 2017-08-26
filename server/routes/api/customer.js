const express = require('express');
const customerRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
const {Messages} = require('../../messages');

customerRouter.post('/setup', [checkAPIKey, checkBody], (req, res, next) => {
  Customer.findOne(
    {messenger_user_id: req.body['messenger user id']}
  )
  .then((customer) => {
    if (!customer) {
      let newCustomer = new Customer({
          messenger_user_id: req.body['messenger user id'],
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
    }
  })
  .catch((err) => next(err));
});

module.exports =  customerRouter;
