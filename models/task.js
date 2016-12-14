var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title : {
		type: String
	},
	startDate : { 
		type: Date
	},
	description : String,
	creatorID : {
		type: String
	},
	watchersID : [{
		type: String
	}]
});

module.exports = mongoose.model('Task',TaskSchema);