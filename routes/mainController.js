var config = require('../config');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();


router.get('/', function(req, res, next) {

    var defaultSearchTerm = undefined;
    var hashtagArray = undefined;

    res.render('pages/main', {
        dive: false
    });
});

module.exports = router;