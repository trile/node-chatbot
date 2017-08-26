let express = require('express');
let router = express.Router();

let apiRouter = require('./api');

router.use('/api', apiRouter);

module.exports = router;
