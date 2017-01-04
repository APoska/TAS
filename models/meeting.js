var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
	title : {
		type: String
	},
	startDate : { 
		type: String
	},
	startTime : {
		type: String
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
	guests : [{}],

},
{
	versionKey: false
});

module.exports = mongoose.model('Meeting', MeetingSchema);