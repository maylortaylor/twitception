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

router.get('/dive', function(req, res, next) {

    var searchTerm = "";
    var hashtagArray = [];
    searchedTweets = [];
    crumbs = [];
    req.session.destroy();

    res.render('pages/home', {
        dive: true,
        seachCriteria: searchTerm !== undefined ? searchTerm : {},
        items: searchedTweets !== undefined ? searchedTweets : {},
        siblingTags: hashtagArray !== undefined ? hashtagArray : {},
        diveCrumbs: crumbs !== undefined ? crumbs : {}
    });
});

router.post('/dive', function(req, res, next) {
    var term = req.body.searchText;

    if (term.startsWith('#')) {
        term = '#' + term;
        while (term.charAt(0) === '#')
            term = term.substr(1);
    }

    if (!term) {
        res.status(400);
        res.send("req.body = " + req.body);
    } else {
        var searchTerm = term;

        crumbs.push(searchTerm);

        req.session.searches = {
            searchTerm: searchTerm,
            dateTimeUtc: new Date()
        };

        //console.log(req.session.searches);

        var tweets = [];
        var hashtagArray = [];

        Twit.TwitterBot.getTweets(searchTerm, 10)
            .then(function(result) {
                if (!result.length) { return null; }

                tweets = result;

                if (!searchTerm.startsWith('#')) {
                    searchTerm = '#' + searchTerm;
                }
                var tweetCollection = {
                    hashtag: searchTerm,
                    tweets: tweets
                }
                searchedTweets.push(tweetCollection);

                //TODO save to storage area


                // db.tweets.save(tweetCollection, function(err, tweet){
                //     if (err) res.send(err);
                //     res.json(tweet);
                // });

                // db.tweets.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, tweet){
                //     if (err) res.send(err);
                //     // console.log(tweet);
                //     res.json(tweet);
                // });

                tweetCollection.tweets.forEach(function(tweet) {
                    var hashArr = (tweet.text.match(/#(\w+)/g));
                    if (!!hashArr && hashArr.length > 1) {
                        hashArr.forEach(function(h) {
                            //console.log(h);
                            hashtagArray.push(h.toLowerCase());
                        });
                    }
                    hashtagArray = _.uniq(hashtagArray);

                }, this);

                // console.log(searchedTweets);


                res.render('pages/home', {
                    dive: true,
                    seachCriteria: searchTerm !== undefined ? searchTerm : {},
                    items: searchedTweets !== undefined ? searchedTweets : {},
                    siblingTags: hashtagArray !== undefined ? hashtagArray : {},
                    diveCrumbs: crumbs !== undefined ? crumbs : {}
                });
            }).catch(function(err) {
                console.log(err)
            });
    }

});

router.get('/dive/:searchText', function(req, res, next) {

    var term = req.params.searchText;

    if (!term) {
        res.status(400);
        res.send("req.params = " + req.params);
    } else {
        var searchTerm = term;

        req.session.searches = {
            searchTerm: searchTerm,
            dateTimeUtc: new Date()
        };

        //console.log(req.session.searches);

        var tweets = [];
        var hashtagArray = [];

        Twit.TwitterBot.getTweets(searchTerm, 10)
            .then(function(result) {
                if (!result.length) { return null; }

                tweets = result;

                var tweetCollection = {
                    hashtag: searchTerm,
                    tweets: tweets
                }
                searchedTweets.push(tweetCollection);

                crumbs.push(searchTerm);
                //TODO save to storage area


                // db.tweets.save(tweetCollection, function(err, tweet){
                //     if (err) res.send(err);
                //     res.json(tweet);
                // });

                // db.tweets.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, tweet){
                //     if (err) res.send(err);
                //     // console.log(tweet);
                //     res.json(tweet);
                // });

                tweetCollection.tweets.forEach(function(tweet) {
                    var hashArr = (tweet.text.match(/#(\w+)/g));
                    if (!!hashArr && hashArr.length > 1) {
                        hashArr.forEach(function(h) {
                            //console.log(h);
                            hashtagArray.push(h.toLowerCase());
                        });
                    }

                    hashtagArray = _.uniq(hashtagArray);

                }, this);

                // console.log(searchedTweets);


                res.render('pages/home', {
                    dive: true,
                    seachCriteria: searchTerm !== undefined ? searchTerm : {},
                    items: searchedTweets !== undefined ? searchedTweets : {},
                    siblingTags: hashtagArray !== undefined ? hashtagArray : {},
                    diveCrumbs: crumbs !== undefined ? crumbs : {}
                });
            }).catch(function(err) {
                console.log(err)
            });
    }

});


module.exports = router;
