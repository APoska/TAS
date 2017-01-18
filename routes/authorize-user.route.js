var express    = require('express');        
var router = express.Router();
var jwt         = require('jwt-simple');
var config      = require('../config/database'); // get db config file

var User = require('../models/user');


router.route('/authorize-user')
	.post(function(req, res){
	  User.findOne({
		login: req.body.login
	  }, function(err, user) {
		if (err){
			res.status(400);
			return res.send(err);
		}
		if (!user) {
			res.status(404);
			res.end();
		} else {
		  // check if password matches
		  user.comparePassword(req.body.password, function (err, isMatch) {
			if (isMatch && !err) {
			  // if user is found and password is right create a token
			  var token = jwt.encode(user, config.secret);
			  // return the information including token as JSON
			  res.status(200);
			  return res.json({token: 'JWT ' + token});
			} else {
				res.status(401);
				res.end();
			}
		  });
		}
	  });
});




module.exports = router;