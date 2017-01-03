var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title : String,
	startDate :	String,
	startTime : String,
	description : String,
	user :  String,
	guests : [{}]
    
},
{
	versionKey: false
});

module.exports = mongoose.model('Task',TaskSchema);
