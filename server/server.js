require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

const {Messages} = require('./messages');

const {checkAPIKey} = require('./middlewares/authenticate');
const {checkBody} = require('./middlewares/check-fbuser');

let {Customer} = require('./models/customer');

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    let now = new Date().toString();
    console.log(`${now}: ${req.method} ${req.url}`);
    next();
  })
};

app.post('/setupcustomer', [checkAPIKey, checkBody], (req, res, next) => {
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
               "text": Message.dual_lang.greeting,
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
               "text": Message.dual_lang.greeting,
             }
          ],
          "redirect_to_blocks": ["Initiate Conversation"]
        })
      }
      else {
        res.status(200).send({
          "set_attributes": {
              "Customer Language": customer.locale,
          },
          "messages": [
            {
              "text": Messages[customer.locale].greeting
            }
          ],
          "redirect_to_blocks": ["Initiate Conversation"]
        })
      }
    }
  })
  .catch((err) => next(err));
});

app.post('/addphone', [checkAPIKey, checkBody], (req, res, next) => {

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then(()=> {
    res.status(200).send({
      "messages": [
         {"text": "Cám ơn bạn!"}
      ]
    })
  })
  .catch((err) => next(err));
});

app.post('/checkphone', [checkAPIKey, checkBody], (req, res, next) => {
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

app.post('/updatephone', [checkAPIKey, checkBody], (req, res, next) => {

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then((customer) => {
    res.status(200).send({
      "messages": [
        {"text": Messages[customer.locale].updatephone(customer.phone_number)}
      ]
    })
  })
  .catch((err) => next(err));
});

/* catch 404 */
app.use((req, res, next) => {
    res.status(404).send("Path not found");
});

/* catch 5xx error */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    //// Log error if necessary
    // fs.appendFile('server.log', `5xx Error: ${err.stack}`, (error) => {
    //     if (error) {
    //         console.log('Unable to append to server.log.')
    //     }
    // });
    res.status(500).send('Server Error');
});

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Starting server on PORT ${process.env.PORT}`);
  }
})

module.exports = {app};
