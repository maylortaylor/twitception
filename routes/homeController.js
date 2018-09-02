var config = require('../config');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();

var searchedTweets = [];
var crumbs = [];

router.get('/', function(req, res, next) {

    var defaultSearchTerm = undefined;
    var hashtagArray = undefined;

    res.render('pages/home', {
        dive: false,
        seachCriteria: defaultSearchTerm !== undefined ? defaultSearchTerm : {},
        items: searchedTweets !== undefined ? searchedTweets : {},
        siblingTags: hashtagArray !== undefined ? hashtagArray : {}
    });
});

router.get('/clear', function(req, res, next) {

    var searchTerm = "";
    var hashtagArray = [];
    searchedTweets = [];
    crumbs = [];

    if (req.session) {
        req.session.destroy();
    }

    res.render('pages/home', {
        dive: false,
        seachCriteria: searchTerm !== undefined ? searchTerm : {},
        items: searchedTweets !== undefined ? searchedTweets : {},
        siblingTags: hashtagArray !== undefined ? hashtagArray : {},
        diveCrumbs: crumbs !== undefined ? crumbs : {}
    });
});

router.get('/settings', function(req, res, next) {

    res.render('pages/settings', {
        
    });
});

module.exports = router;