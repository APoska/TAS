var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file

var User = require('../models/user');


router.route('/users')
	.get(function(req,res){
		User.find(function(err,tasks){
			if(err)
				res.send(err);
			res.json(tasks);
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
		User.findById(req.params.user_id,function(err,task){
			if(err)
				res.send(err);
			res.json(task);
		});
	})
	.delete(function(req,res){
		User.remove({
			_id: req.params.user_id
		}, function(err,task){
			if(err)
				res.send(err);
			res.json({message: 'User succesfully deleted'});
		});
	})
	.put(function(req,res){
		User.findById(req.params.user_id,function(err,user){
			if(err)
				res.send(err);
			
			user.save(function(err){
				if(err)
					res.send(err);
				res.json({message: 'User updated!'});
			});
		});
	});

module.exports = router;