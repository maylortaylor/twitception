var Twit = require('../public/scripts/TwitterBot');
var config = require('../config');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();

var searchedTweets = [];
var crumbs = [];


router.get('/tweets', function(req, res, next) {
    db.tweets.find(function(err, tweets) {
        if (err) res.send(err);
        // console.log(tweets);
        res.json(tweets);
    })
});

router.get('/tweet/:id', function(req, res, next) {
    db.tweets.findOne({ _id: mongojs.ObjectId(req.params.id) }, function(err, tweet) {
        if (err) res.send(err);
        // console.log(tweet);
        res.json(tweet);
    })
});

module.exports = router;