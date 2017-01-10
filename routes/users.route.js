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

		User.find(queryObj, { password: 0 }, function(err,users){
			if(err)
			{
				res.status(400);
				res.send(err);
			}
			if(users.length < 1)
			{
				res.status(404);
				res.send(err);
			}

			res.status(200);
			res.location('http://localhost:8080/api/users');
			res.json(users);
			
		});
	})
	.post(function(req,res){
		if (!req.body.login || !req.body.password) {
			res.status(400);
			res.send(err);
	  	} 
		    
	    var newUser = new User({
		   	name: req.body.name,
		    login: req.body.login,
		    password: req.body.password,
		    email: req.body.email
	    });

	    newUser.save(function(err) {
	        if (err) 
	        {
		   		res.status(409);
				res.send(err);
	        }
	        res.status(201);
	 		res.location('http://localhost:8080/api/users');
	        res.json(req.body);
	    });
		  
	});


router.route('/users/:user_id')
	.get(function(req,res){
		User.findById({ _id : req.params.user_id },function(err,user){
			if(!user){
				res.status(404);
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
				res.status(404);
			}else{
				user.remove(function(err) {
				    if (err) {
				    	res.status(400);
			    		res.send(err);
				    }else{
				    	res.status(204);
				    }
				});
			}
			
		});
	})
	.patch(function(req,res){
		User.findById({ _id : req.params.user_id }, function(err,user){
			if(!user){
				res.status(404);
				res.json({success: false, msg: 'User not found'});
			}else{

				User.update({ _id : req.params.user_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(200);
						res.json({success: true, msg: 'User updated!'});
					}
				
				});
			}
		});
	});
module.exports = router;