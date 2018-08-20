var express = require('express');
var app = express();
// var RedisStore = require('connect-redis')(express);
// var crypto = require('crypto');
// const secret = 'user';
// const hash = crypto.createHmac('sha256', secret)
//                    .update('I love cupcakes')
//                    .digest('hex');

var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var config = require('./config');
var moment = require('moment');
var shortDateFormat = "dddd MMM Do YYYY, @ h:mm:ss A"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;

// var less = require('less');
// var serverConfig = require('./serverConfig.json');

// console.log(serverConfig);
// var redis = require("redis").createClient(serverConfig.redisPort,serverConfig.redisHost);


//
////ADD CONTROLLERS HERE
//
var search = require('./routes/search');
var mainController = require('./routes/mainController');

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'user'
}));

//
////ERROR HANDELING
//
function logErrors(err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

function errorHandler(err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());

// override with different headers; last one takes precedence
// app.use(methodOverride('X-HTTP-Method'))          // Microsoft
// app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
// app.use(methodOverride('X-Method-Override'))      // IBM
// app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
// app.use(express.errorHandler(serverConfig.errorHandlerOptions));



// set view engine (ejs, jade, ...)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//
////SET IN APP VARIABLES??
//
app.use('/css', express.static(__dirname + '/public/css/'));
app.use('/fonts', express.static(__dirname + '/public/fonts/'));
app.use('/scripts', express.static(__dirname + '/public/scripts/'));

//
////DEPEND ON CONTROLLERS HERE
//
app.use('/', search);
app.use('/', mainController);

//
////CREATE APP > LIST ON SERVER_PORT > CONSOLE LOG INFO
//
http.createServer(app).listen(config.server().SERVER_PORT, function() {
    console.log('Go To >> http://localhost:3000/')
});