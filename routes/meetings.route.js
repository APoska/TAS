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
					res.json(meetings);
				}
			});
		}else{
			Meeting.find(function(err,meetings){
				if(err){
					res.status(400);
					return res.send(err);
				}else{
					res.status(200);
					res.json(meetings);
				}
			});
		}
	})
	.post(function(req,res){
		var meeting = new Meeting({
			title: req.body.title,
			startDate: req.body.startDate,
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
				return res.json({success: true, msg: 'Meeting created'});				
			}
		});
	});

router.route('/meetings/:meeting_id')
.get(function(req,res){
	Meeting.findById(req.params.meeting_id,function(err,meeting){
		if(!meeting){
			res.status(404);
			res.json({success: false, msg: 'Meeting not found'});
		}else{
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.json(meeting);				
			}
		}

	});
})
.delete(function(req,res){
	Meeting.findById({ _id : req.params.meeting_id }, function(err,meeting){
		
		if(!meeting){
			res.status(409);
			res.json({success: false, msg: 'Meeting not found'});
		}else{

			meeting.remove(function(err) {
			    if (err) return res.send(err);

				res.status(200);
				res.json({success: true, msg: 'Meeting succesfully deleted'});
			});
		}
	});
})
.patch(function(req,res){
		Meeting.findById({ _id : req.params.meeting_id }, function(err,meeting){
			if(!user){
				res.status(404);
				res.json({success: false, msg: 'Meeting not found'});
			}else{

				Meeting.update({ _id : req.params.meeting_id }, req.body, function(err){
					if(err){
						res.status(400);
						return res.send(err);
					}else{
						res.status(200);
						res.json({success: true, msg: 'Meeting updated!'});
					}
				
				});
			}
		});
	});

module.exports = router;