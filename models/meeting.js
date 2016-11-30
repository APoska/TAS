var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
	title : {
		type: String
	},
	startDate : { 
		type: Date
	},
	endDate : { 
		type: Date
	},
	place : {
		type : String
	},
	description : {
		type : String
	},
	creatorID : {
		type: String
	},
	watchersID : [{
		type: String
	}],

});

module.exports = mongoose.model('Meeting', MeetingSchema);