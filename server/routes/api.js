const express = require('express');
const apiRouter = express.Router();

const customerRouter = require('./api/customer');
const localeRouter = require('./api/locale');
const phoneRouter = require('./api/phone');
const appointmentRouter = require('./api/appointment');

apiRouter.use('/customer', customerRouter);
apiRouter.use('/locale', localeRouter);
apiRouter.use('/phone', phoneRouter);
apiRouter.use('/appointment', appointmentRouter);

module.exports = apiRouter;
