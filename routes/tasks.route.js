var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file

var Task = require('../models/task');

router.route('/tasks')
	.get(function(req,res){
		Task.find(function(err,tasks){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.json(tasks);
			}
		});
	})
	.post(function(req,res){
		var task = new Task({
			title: req.body.title,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			description: req.body.description,
			creatorID: req.body.user,
			watchersID: req.body.guests
		});
		if(task.endDate < task.startDate){
				res.status(400);
				res.json({success: false, msg: "Start date cannot be later than end date."})
		}else{
			task.save(function(err){
				if(err){
					res.status(400);
					res.send(err);
				} else{
					res.status(201);
					return res.json({success: true, msg: 'Task created'});				
				}

			});
		}
	});

router.route('/tasks/:task_id')
	.get(function(req,res){
		Task.findById(req.params.task_id,function(err,task){
			if(task===null){
				res.status(404);
				res.json({success: false, msg: 'Task not found.'});
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
		Task.remove({
			_id: req.params.task_id
		}, function(err,task){
			if(task===null){
				res.status(404);
				res.json({success: false, msg: 'Task not found.'});
			}else{
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.json({success: true, msg: 'Task succesfully deleted'});
				}
			}
		});
	})
	.put(function(req,res){
		Task.findById(req.params.task_id,function(err,task){
			var task = new Task({
				title: req.body.title,
				startDate: req.body.startDate,
				endDate: req.body.endDate,
				description: req.body.description,
				creatorID: req.body.user,
				watchersID: req.body.guests
			});
			if(task===null){
				res.status(404);
				res.json({success: false, msg: 'Task not found.'});
			}else if(task.endDate < task.startDate){
				res.status(400);
				res.json({success: false, msg: "Start date cannot be later than end date."});
			}else{
				if(err){
					res.status(400);
					res.send(err);
				}else{
					task.save(function(err){
						if(err){
							res.status(400);
							res.send(err);
						}else{
							res.status(200);
							res.json({success: true, msg: 'Task updated!'});
						}
					});
				}
			}
			
			
		});
	});
	
	module.exports = router;