const express = require('express');
const apiRouter = express.Router();

const customerRouter = require('./api/customer');
const localeRouter = require('./api/locale');
const phoneRouter = require('./api/phone');

apiRouter.use('/customer', customerRouter);
apiRouter.use('/locale', localeRouter);
apiRouter.use('/phone', phoneRouter);

module.exports = apiRouter;
