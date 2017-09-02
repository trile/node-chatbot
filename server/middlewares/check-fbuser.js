//TODO: NEED TO CHECK IF THE USER IS IN THE DATABASE

function checkBody(req, res, next) {
    if (!req.body['messenger user id']) {
      res.status(400).send('Bad request: No messenger id.');
    }
    else {
      next();
    }
}

function checkParam(req, res, next) {
  if (!req.query.user_id) {
    res.status(400).send('Bad request: No messenger id.');
  }
  else {
    next();
  }

}

module.exports = {checkBody, checkParam};
