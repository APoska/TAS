var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
	title : {
		type: String
	},
	startDate : { 
		type: Date
	},
	place : {
		type : String
	},
	description : {
		type : String
	},
	user : {
		type: String
	},
	quests : [{
		type: String
	}],

});

module.exports = mongoose.model('Meeting', MeetingSchema);