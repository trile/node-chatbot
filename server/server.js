require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {checkAPIKey} = require('./middlewares/authenticate');
const {checkFBUserExist} = require('./middlewares/check-fbuser');

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

app.get('/test', checkAPIKey, (req, res, next) => {
  res.status(200).send("Correct API key");
})


app.post('/addcustomer' , (req, res, next) => {

})

app.post('/findcustomer', [checkAPIKey, checkFBUserExist], (req, res, next) => {
});

app.post('/addphone', [checkAPIKey, checkFBUserExist], (req, res, next) => {

  let customer = new Customer({
      messenger_user_id: req.body['messenger user id'],
      phone_number: req.body['phone number']
  });

  customer.save()
  .then(()=> {
    res.status(200).send({
      "messages": [
         {"text": "Cám ơn bạn!"}
      ]
    })
  })
  .catch((err) => next(err));
});

app.post('/checkphone', [checkAPIKey, checkFBUserExist], (req, res, next) => {
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
        "redirect_to_blocks": ["Get Customer Information"]
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
                "text": `Số điện thoại của bạn là ${customer.phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?`,
                "buttons": [
                  {
                    "type": "show_block",
                    "block_name": "Update Customer Information",
                    "title": "Thay đổi"
                  },
                  {
                    "type": "show_block",
                    "block_name": "Finish Get Customer Phone Number",
                    "title": "Không"
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

app.post('/updatephone', [checkAPIKey, checkFBUserExist], (req, res, next) => {

  Customer.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then((customer) => {
    res.status(200).send({
      "messages": [
        {"text": `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${customer.phone_number}`}
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
