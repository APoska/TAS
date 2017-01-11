var express    = require('express');        
var router = express.Router();
var jwt         = require('jwt-simple');
var config      = require('../config/database'); // get db config file
var passport	= require('passport');

var User = require('../models/user');

require('../config/passport')(passport);

router.route('/check-user-authorization')
	.get(passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      login: decoded.login
    }, function(err, user) {
        if (err) {
          res.status(400);
          return res.send(err);
        }
 
        if (!user) {
          res.status(404);
          res.end(); 
        } else {
          res.status(200);
          return res.json(user);
        }
    });
  } else {
    res.status(403);
    res.end();
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;