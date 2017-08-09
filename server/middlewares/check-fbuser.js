function checkFBUserExist(req, res, next) {
    if (!req.body['messenger user id']) {
      res.status(400).send('Bad request');
    }
    else {
      next();
    }
}

module.exports = {checkFBUserExist};
