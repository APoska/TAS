var express = require('express');        
var router = express.Router();
var config 	= require('../config/database'); 
var Meeting = require('../models/meeting');


router.route('/meetings')
	.get(function(req,res){
		var creator = req.query.user;
		
		if(typeof creator != "undefined"){
			Meeting.find({user : creator}, function(err,meetings){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(meetings);
				}
			});
		}else{
			Meeting.find(function(err,meetings){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					return res.json(meetings);
				}
			});
		}
	})
	.post(function(req,res){
		var meeting = new Meeting({
			title: req.body.title,
			startDate: req.body.startDate,
			startTime: req.body.startTime,
			place: req.body.place,
			description: req.body.description,
			user: req.body.user,
			guests: req.body.guests
		});
		meeting.save(function(err){
			if(err){
				res.status(400);
				return res.send(err);
			} else{
				res.status(201);
				res.location("http://localhost:8080/api/meetings/"+meeting._id);
				return res.json({Meeting : meeting});	
			}
		});
	});

router.route('/meetings/:meeting_id')
.get(function(req,res){
	Meeting.findById(req.params.meeting_id,function(err,meeting){
		if(!meeting){
			res.status(404);
			res.end();
		}else{
			if(err){
				res.status(400);
				return res.send(err);
			}else{
				res.status(200);
				return res.json(meeting);				
			}
		}

	});
})
.delete(function(req,res){
	Meeting.findById({ _id : req.params.meeting_id }, function(err,meeting){
		
		if(!meeting){
			res.status(404);
			res.end();
		}else{
			meeting.remove(function(err) {
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
		Meeting.findById({ _id : req.params.meeting_id }, function(err,meeting){
			if(!meeting){
				res.status(404);
				res.end();
			}else{
				Meeting.update({ _id : req.params.meeting_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(201);
						res.location("http://localhost:8080/api/meetings/"+meeting._id);
						return res.json(meeting);
					}
				});
			}
		});
	});

module.exports = router;