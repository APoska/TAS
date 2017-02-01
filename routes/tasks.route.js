var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file
var url = require('url');

var Task = require('../models/task');

router.route('/tasks')
	.get(function(req,res){
		var creator = req.query.user;
		
		if(typeof creator != "undefined"){
			Task.find({$or:[{user : creator},{$and:[{'guests.id':{$in:[creator]}},{'guests.flag':{$in:['pending','accepted']}}]}]}, function(err,tasks){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(tasks);
				}
			});
		}else{
			Task.find(function(err,tasks){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(tasks);
				}
			});
		}
		
		
	})
	.post(function(req,res){
		var task = new Task({
			title: req.body.title,
			startDate: req.body.startDate,
			startTime: req.body.startTime,
			description: req.body.description,
			status: req.body.status,
			user: req.body.user,
			guests: req.body.guests,
		});

		
		task.save(function(err){
			if(err){
				res.status(400);
				return res.send(err);
			} else{
				res.status(201);
				res.location("http://localhost:8080/api/tasks/"+task._id);
				return res.json({Task : task});
			}

		});
		
	});

router.route('/tasks/:task_id')
	.get(function(req,res){
		Task.findById(req.params.task_id,function(err,task){
			if(!task){
				res.status(404);
				res.end()
			}else{
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(task);				
				}
			}

		});
	})
	.delete(function(req,res){
		Task.findById({ _id : req.params.task_id }, function(err,task){
			
			if(!task){
				res.status(404);
				res.end();
			}else{
				task.remove(function(err) {
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
		Task.findById({ _id : req.params.task_id }, function(err,task){
			if(!task){
				res.status(404);
				res.end();
			}else{
				Task.update({ _id : req.params.task_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(201);
						res.location("http://localhost:8080/api/tasks/"+task._id);
						return res.json(task);
					}
				
				});
			}
		});
	});
	
	module.exports = router;
