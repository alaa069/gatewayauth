const jwt = require('jwt-simple');
const validateUser = require('../routes/auth').validateUser;
const config = require('../config/config');

module.exports = function(req, res, next) {

  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 

  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();

  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var key = (req.body && req.body.key) || (req.query && req.query.key) || req.headers['key'];

  if (token && key) {
    try {
      var decoded = jwt.decode(token, config.secret);

      if (decoded.exp <= Date.now()) {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token Expired"
        });
        return;
      }

      // Authorize the user to see if s/he can access our resources

      validateUser(key, token, function(dbUser){
        if (dbUser) {

          if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 )) {
            next(); // To move to next middleware
          } else if((req.url.indexOf('user') >= 0 && dbUser.role == 'user') || (req.url.indexOf('user') < 0)){
            next(); // To move to next middleware
          } else {
            res.status(403);
            res.json({
              "status": 403,
              "message": "Not Authorized"
            });
            return;
          }
        } else {
          // No user with this name exists, respond back with a 401
          res.status(401);
          res.json({
            "status": 401,
            "message": "Invalid User"
          });
          return;
        }
      }); // The key would be the logged in user's username

    } catch (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token or Key"
    });
    return;
  }
};