require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const {mongoose} = require('./db/mongoose');

const {Messages} = require('./messages');

const {checkAPIKey} = require('./middlewares/authenticate');
const {checkBody} = require('./middlewares/check-fbuser');

let router = require('./routes/index')

let app = express();
app.use(helmet());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   console.log(req.headers.origin);
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    let now = new Date().toString();
    console.log(`${now}: ${req.method} ${req.url}`);
    next();
  })
};

app.use('/', router);

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
