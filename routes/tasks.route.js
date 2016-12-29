var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file
var url = require('url');

var Task = require('../models/task');

router.route('/tasks')
	.get(function(req,res){
		var creator = req.query.user;
		
		if(typeof creator != "undefined"){
			Task.find({user : creator}, function(err,tasks){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					res.json(tasks);
				}
			});
		}else{
			Task.find(function(err,tasks){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					res.json(tasks);
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
			user: req.body.user,
			guests: req.body.guests
		});

		
		task.save(function(err){
			if(err){
				res.status(400);
				return res.send(err);
			} else{
				res.status(201);
				return res.json({success: true, msg: 'Task created'});				
			}

		});
		
	});

router.route('/tasks/:task_id')
	.get(function(req,res){
		Task.findById(req.params.task_id,function(err,task){
			if(!task){
				res.status(404);
				res.json({success: false, msg: 'Task not found'});
			}else{
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.json(task);				
				}
			}

		});
	})
	.delete(function(req,res){
		Task.findById({ _id : req.params.task_id }, function(err,task){
			
			if(!task){
				res.status(409);
				res.json({success: false, msg: 'Task not found'});
			}else{

				task.remove(function(err) {
				    if (err) return res.send(err);

					res.status(200);
					res.json({success: true, msg: 'Task succesfully deleted'});
				});
			}
		});
	})
	.patch(function(req,res){
		Task.findById({ _id : req.params.task_id }, function(err,task){
			if(!task){
				res.status(404);
				res.json({success: false, msg: 'Task not found'});
			}else{

				Task.update({ _id : req.params.task_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(200);
						res.json({success: true, msg: 'Task updated!'});
					}
				
				});
			}
		});
	});
	
	module.exports = router;
