require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

let {Client} = require('./models/client');

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

app.post('/addclient',(req, res, next) => {
  if (!req.body['messenger user id']) return res.status(400).send('Bad request');

  let client = new Client({
      messenger_user_id: req.body['messenger user id'],
      phone_number: req.body['phone number']
  });

  client.save()
  .then(()=> {
    res.status(200).send({
      "messages": [
         {"text": "Cám ơn bạn!"}
      ]
    })
  })
  .catch((err) => next(err));
});

app.post('/findclient', (req, res, next) => {
  if (!req.body['messenger user id']) return res.status(400).send('Bad request');
  console.log(req.body);
  Client.findOne(
    {messenger_user_id: req.body['messenger user id']}
  )
  .then((client) => {

    if (!client) {
      res.status(200).send({
        "redirect_to_blocks": ["Get Customer Information"]
      })
    }
    else {
      res.status(200).send({
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": `Số điện thoại của bạn là ${client.phone_number}, Bạn có muốn thay đổi số điện thoại của bạn không?`,
                "buttons": [
                  {
                    "type": "show_block",
                    "block_name": "Get Customer Information",
                    "title": "Thay đổi"
                  },
                  {
                    "type": "show_block",
                    "block_name": "Intro",
                    "title": "Không"
                  }
                ]
              }
            }
          }
        ]
      })
    }
  })
  .catch((err) => next(err));
});

app.post('/updatephone', (req, res, next) => {
  if (!req.body['messenger user id']) return res.status(400).send('Bad request');

  Client.findOneAndUpdate(
    {messenger_user_id: req.body['messenger user id']},
    {$set:{phone_number: req.body['phone number']}},
    {new: true} //this is for findOneAndUpdate to return the updated object
  )
  .then((client) => {
    res.status(200).send({
      "messages": [
        {"text": `Số điện thoại mới của bạn là ${client.phone_number}`}
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
