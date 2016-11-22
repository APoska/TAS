var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title : {
		type: String,
		required : true
	},
	startDate : { 
		type: Date,
		required:true
	},
	endDate : { 
		type: Date,
		required:true
	},
	description : String,
	creatorID : {
		type: String,
		required: true
	},
	watchersID : []
});

module.exports = mongoose.model('Task',TaskSchema);