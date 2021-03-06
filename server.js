var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var config = require('./config');
var moment = require('moment');
var shortDateFormat = "dddd MMM Do YYYY, @ h:mm:ss A"; // this is just an example of storing a date format once so you can change it in one place and have it propagate
app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = shortDateFormat;

//
////ADD CONTROLLERS HERE
//
var searchController = require('./routes/searchController');
var homeController = require('./routes/homeController');
var diveController = require('./routes/diveController');
var tweetController = require('./routes/tweetController');

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
app.use(expressLayouts);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
// app.use(express.errorHandler(serverConfig.errorHandlerOptions));

// set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//
////SET IN APP VARIABLES
//
app.use('/css', express.static(__dirname + '/public/css/'));
app.use('/fonts', express.static(__dirname + '/public/fonts/'));
app.use('/scripts', express.static(__dirname + '/public/scripts/'));

//
////DEPEND ON CONTROLLERS HERE
//
app.use('/', searchController);
app.use('/', homeController);
app.use('/', diveController);
app.use('/', tweetController);
//
////CREATE APP > LIST ON SERVER_PORT > CONSOLE LOG INFO
//
http.createServer(app).listen(config.server().SERVER_PORT, function() {
    console.log('Go To >> http://localhost:3000/')
});