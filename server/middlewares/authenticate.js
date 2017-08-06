
function checkAPIKey(req, res, next) {
    if (req.query.token !== process.env.API_TOKEN) {
      res.status(403).send('Forbidden.')
    }
    else {
      next();
    }
}

module.exports = {checkAPIKey};
