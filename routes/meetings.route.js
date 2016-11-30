var express = require('express');        
var router = express.Router();
var config 	= require('../config/database'); 
var Meeting = require('../models/meeting');


router.route('/meetings')
	.get(function(req,res){
		Meeting.find(function(err,meetings){
			if(err){
				res.status(400);
				return res.send(err);
			}else{
				res.status(200);
				res.json(meetings);
			}
		});
	})
	.post(function(req,res){
		var meeting = new Meeting({
			title: req.body.title,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			place: req.body.place,
			description: req.body.description,
			creatorID: req.body.creatorID,
			watchersID: req.body.watchersID
		});
		if(meeting.endDate < meeting.startDate){
				res.status(400);
				res.json({success: false, msg: "Start date cannot be later than end date."})
		}else{
			meeting.save(function(err){
				if(err){
					res.status(400);
					return res.send(err);
				} else{
					res.status(201);
					return res.json({success: true, msg: 'Meeting created'});				
				}

			});
		}
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
.put(function(req,res){
	Meeting.findById({ _id : req.params.meeting_id }, function(err,meeting){
		if(err)
			return res.send(err);

		if(req.body.title == meeting.title ||
			req.body.startDate == meeting.startDate ||
			req.body.endDate == meeting.endDate ||
			req.body.description == meeting.description ||
			req.body.place == meeting.place ||
			req.body.creatorID == meeting.creatorID ||
			req.body.watchersID == meeting.watchersID){

			res.status(409);
	        res.json({success: false, msg: 'You cant change data to same values'});	
		}else{

			if(!req.body.title){meeting.title = meeting.title;}else{meeting.title = req.body.title}
			if(!req.body.startDate){meeting.startDate = meeting.startDate;}else{meeting.startDate = req.body.startDate}
			if(!req.body.endDate){meeting.endDate = meeting.endDate;}else{meeting.endDate = req.body.endDate}
			if(!req.body.description){meeting.description = meeting.description;}else{meeting.description = req.body.description}
			if(!req.body.place){meeting.place = meeting.place;}else{meeting.place = req.body.place}
			if(!req.body.creatorID){meeting.creatorID = meeting.creatorID;}else{meeting.creatorID = req.body.creatorID}
			if(!req.body.watchersID){meeting.watchersID = meeting.watchersID;}else{meeting.watchersID = req.body.watchersID}


			meeting.save(function(err){
				if(err)
					return res.send(err);
			});
			res.status(200);
			res.json({success: true, msg: 'Meeting updated!'});
		}
	});
});

module.exports = router;