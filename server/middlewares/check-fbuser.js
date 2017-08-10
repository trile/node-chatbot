function checkBody(req, res, next) {
    if (!req.body['messenger user id']) {
      res.status(400).send('Bad request: No messenger id.');
    }
    else {
      next();
    }
}

module.exports = {checkBody};
