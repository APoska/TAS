var express    = require('express');        
var router = express.Router();
var config      = require('../config/database'); // get db config file

var Task = require('../models/task');

router.route('/tasks')
	.get(function(req,res){
		Task.find(function(err,tasks){
			if(err){
				res.status(400);
				return res.send(err);
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
					return res.send(err);
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
	.put(function(req,res){
		Task.findById({ _id : req.params.task_id }, function(err,task){
			if(err)
				return res.send(err);

			if(req.body.title == task.title ||
				req.body.startDate == task.startDate ||
				req.body.endDate == task.endDate ||
				req.body.description == task.description ||
				req.body.user == task.user ||
				req.body.guests == task.guests){

				res.status(409);
		        res.json({success: false, msg: 'You cant change data to same values'});	
			}else{

				if(!req.body.title){task.title = task.title;}else{task.title = req.body.title}
				if(!req.body.startDate){task.startDate = task.startDate;}else{task.startDate = req.body.startDate}
				if(!req.body.endDate){task.endDate = task.endDate;}else{task.endDate = req.body.endDate}
				if(!req.body.description){task.description = task.description;}else{task.description = req.body.description}
				if(!req.body.user){task.user = task.user;}else{task.user = req.body.user}
				if(!req.body.guests){task.guests = task.guests;}else{task.guests = req.body.guests}


				task.save(function(err){
					if(err)
						return res.send(err);
				});
				res.status(200);
				res.json({success: true, msg: 'Task updated!'});
			}
		});
	});
	
	module.exports = router;