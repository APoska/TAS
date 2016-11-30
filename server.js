// MODULES
var express    = require('express');        
var app        = express();   
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var passport	= require('passport');
var jwt         = require('jwt-simple');

// CONFIG
var config      = require('./config/database'); // get db config file

// MODELS
var Task = require('./models/task');
var User = require('./models/user');

// ROUTES
var authRoute = require('./routes/auth.route.js');
var checkauthRoute = require('./routes/checkauth.route.js');
var tasksRoute = require('./routes/tasks.route.js');
var usersRoute = require('./routes/users.route.js');
var meetingsRoute = require('./routes/meetings.route.js');

//BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MONGO CONNECT
mongoose.connect(config.database);


require('./config/passport')(passport);


var router = express.Router();
router.use(function(req,res,next){
	console.log('Request');
	next();
});
	
var port = process.env.PORT || 8080;        // set our port

app.use('/', express.static(__dirname));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


// API USE
app.use('/api', authRoute);
app.use('/api', checkauthRoute);
app.use('/api', tasksRoute);
app.use('/api', usersRoute);
app.use('/api', meetingsRoute);

app.listen(port);
console.log('Server started on port ' + port);