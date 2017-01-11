var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file

var User = require('../models/user');


router.route('/users')
	.get(function(req,res){
		var queryObj = {};
		if (req.query.login){
			queryObj.login = {"$in": req.query.login}
		} 

		User.find(queryObj, {password : 0}, function(err,users){
			if(err)
			{
				res.status(400);
				return res.send(err);
			}
			if(users.length < 1)
			{
				res.status(404);
				res.end();
			}

			res.status(200);
			return res.json(users);
		});
	})
	.post(function(req,res){
		if (!req.body.login || !req.body.password) {
		    res.status(400);
		 	res.end();
		  } else {
		    var newUser = new User({
  		      name: req.body.name,
		      login: req.body.login,
		      password: req.body.password,
		      email: req.body.email
		    });
		    // save the user
		    newUser.save(function(err) {
		      if (err) {
				res.status(409);
		        return res.send(err);
		      }
		      res.status(201);
		      res.location('http://localhost:8080/api/users/'+newUser._id);
		      return res.json({User:newUser});
		    });
		  }
		});


router.route('/users/:user_id')
	.get(function(req,res){
		User.findById({ _id : req.params.user_id }, {password : 0} ,function(err,user){
			if(!user){
				res.status(404);
				res.end();
			}else{
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(user);				
				}
			}
		});
	})
	.delete(function(req,res){

		User.findById({ _id : req.params.user_id }, function(err,user){
			
			if(!user){
				res.status(404);
				res.end();
			}else{
				user.remove(function(err) {
				    if (err){
				    	res.status(400);
						return res.send(err);	
				    } 
					res.status(204);
					res.end();
				});
			}
		});
	})
	.patch(function(req,res){
		User.findById({ _id : req.params.user_id }, {password : 0}, function(err,user){
			if(!user){
				res.status(404);
				res.end();
			}else{
				User.update({ _id : req.params.user_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(200);
						res.location('http://localhost:8080/users/' + user._id)
						return res.json(user);
					}
				
				});
			}
		});
	});
module.exports = router;