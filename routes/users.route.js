var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file

var User = require('../models/user');


router.route('/users')
	.get(function(req,res){
		User.find(function(err,users){
			if(err){
				res.status(400);
				return res.send(err);
			}else{
				res.status(200);
				res.json(users);
			}
		});
	})
	.post(function(req,res){
		if (!req.body.login || !req.body.password) {
		    res.json({success: false, msg: 'Please pass name and password.'});
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
		        return res.json({success: false, msg: 'Username already exists.'});
		      }
		      res.json({success: true, msg: 'Successful created new user.'});
		    });
		  }
		});


router.route('/users/:user_id')
	.get(function(req,res){
		User.findById({ _id : req.params.user_id },function(err,user){
			if(!user){
				res.status(404);
				res.json({success: false, msg: 'User not found'});
			}else{
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.json(user);				
				}
			}
		});
	})
	.delete(function(req,res){

		User.findById({ _id : req.params.user_id }, function(err,user){
			
			if(!user){
				res.status(409);
				res.json({success: false, msg: 'User not found'});
			}else{

				user.remove(function(err) {
				    if (err) return res.send(err);

					res.status(200);
					res.json({success: true, msg: 'User succesfully deleted'});
				});
			}
		});
	})
	.put(function(req,res){
		User.findById({ _id : req.params.user_id }, function(err,user){
			if(err)
				return res.send(err);

			

			if(req.body.name == user.name ||
				req.body.login == user.login ||
				req.body.password == user.password ||
				req.body.email == user.email){

				res.status(409);
		        res.json({success: false, msg: 'You cant change data to same values'});	
			}else{
				if(!req.body.name){user.name = user.name;}else{user.name = req.body.name}
				if(!req.body.login){user.login = user.login;}else{user.login = req.body.login}
				if(!req.body.password){user.password = user.password;}else{user.password = req.body.password}
				if(!req.body.email){user.email = user.email;}else{user.email = req.body.email}

				user.save(function(err){
					if(err)
						return res.send(err);
				});
				res.status(200);
				res.json({success: true, msg: 'User updated!'});
			}
		});
	});
module.exports = router;