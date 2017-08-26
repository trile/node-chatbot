const express = require('express');
const localeRouter = express.Router();

const {checkAPIKey} = require('../../middlewares/authenticate');
const {checkBody} = require('../../middlewares/check-fbuser');

let {Customer} = require('../../models/customer');
const {Messages} = require('../../messages');


localeRouter.post('/set', [checkAPIKey, checkBody], (req, res, next) => {
  if (!req.body['language']) {
    res.status(400).send('Bad request: No language.');
    return;
  }

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set: {locale: req.body['language']}},
    {new: true}
  )
  .then((customer) => {
    res.status(200).send({
      "messages": [
        {
          "text": Messages[customer.locale].setlocate
        }
      ],
      "set_attributes": {
          "language": customer.locale,
      },
      "redirect_to_blocks": ["Finish Customer Locale"]
    });
  })
  .catch((err) => next(err));

});


module.exports = localeRouter;
