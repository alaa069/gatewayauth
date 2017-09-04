const jwt = require('jwt-simple');
const GU = require('../model/user').GU;
const config = require('../config/config');

var auth = {

  login: function(req, res) {

    var rols = ['admin', 'user']
    var username = req.body.username || '';
    var password = req.body.password || '';
    var role = ((typeof(req.body.role) !='undifined')&&(rols.includes(req.body.role.toLowerCase()))) ? req.body.role.toLowerCase() : 'user';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password, role, function(dbUserObj){
      if (!dbUserObj) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }

      if (dbUserObj) {

        // If authentication is success, we will generate a token
        // and dispatch it to the client

        res.json(genToken(dbUserObj));
      }
    });

  },
  test: function(req, res) {

    var username = 'alaa';
    var password = 'alaa';
    var role = 'admin';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }

    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password, role, function(dbUserObj){
      if (!dbUserObj) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }

      if (dbUserObj) {

        // If authentication is success, we will generate a token
        // and dispatch it to the client

        res.json(dbUserObj);
      }
    });

  },

  validate: function(username, password, role, callback) {
    // spoofing the DB response for simplicity
    /*var dbUserObj = { // spoofing a userobject from the DB. 
      password: password,
      role: role,
      username: username
    };

    return dbUserObj;*/
    GU.findOne({username:username}, function(err, doc){
      if (err){
        callback(null)
      }else if (doc){
        if(password==doc.password){
          var token = {
            token : genToken()
          }
          doc.token = token;
          doc.save(function(err, docs){
            if (err) callback(null)
            else callback(docs);
          })
          callback(doc)
        } else{
          callback(null)
        }
      } else {
        var token = {
          token : genToken()
        }
        var dbUserObj = {
          password: password,
          role: role,
          username: username,
          token : token
        };
        var gatwayUser = new GU(dbUserObj)
        gatwayUser.save(function(err){
          if (err) callback(null)
          else callback(dbUserObj);
        })
      }
    })
  },

  validateUser: function(key, token, callback) {
    GU.findById(key, function(err, doc){
      if (err){
        callback(null)
      }else if (doc){
        if(token==doc.token.token){
          callback(doc)
        } else{
          callback(null)
        }
      } else {
        callback(null)
      }
    })
  },
}

// private method
function genToken() {
  var expires = expiresIn(7); // 7 days
  return jwt.encode({
    exp: expires
  }, config.secret);
  //}, require('../config/secret')());

  /*return {
    token: token,
    expires: expires,
    user: user
  };*/
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;