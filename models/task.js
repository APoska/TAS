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
	user : {
		type: String
	},
	guests : [{
		type: String
	}]
},
{
	versionKey: false
});

module.exports = mongoose.model('Task',TaskSchema);