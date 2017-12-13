'use strict';
var config = require('../../config');
var Twit = require('Twit');


//
/////  https://github.com/ttezel/twit
//

var TwitterSpace = TwitterSpace || {};

TwitterSpace.TwitterBot = function() {
    var tweets = [];
    var T = new Twit(config.twit());

    function randIndex(arr) {
        var index = Math.floor(arr.length * Math.random());
        return arr[index];
    };

    var getTweets = function(searchtext, count) {
        return new Promise(function(resolve, reject) {
            var self = this;
            if (!searchtext.startsWith('#')) {
                searchtext = '#' + searchtext;
            }
            var params = {
                q: searchtext,
                count: count
            }
            console.log(params);
            T.get('search/tweets', params, gotData);

            function gotData(err, data, response) {
                if (err) return callback(err);
                tweets = data.statuses;
                //console.log(tweets);

                if (!!tweets.length) {

                    //console.log('gotData: ' + tweets.length);
                    // return tweets;
                    resolve(tweets);
                } else {
                    reject(Error("It broke"));
                }
                return tweets;
            }

        });
    };

    var tweet = function(text, res) {
        var self = this;

        if (typeof status !== 'string') {
            return callback(new Error('tweet must be of type String'));
        } else if (status.length > 140) {
            return callback(new Error('tweet is too long: ' + status.length));
        }

        T.post('statuses/update', { text: text }, gotData);

        function gotData(err, data, response) {
            if (err) return callback(err);
            console.log('data', data);
            console.log('response', response);
        }
    };

    var tweetAt = function(text, tweetingAtId, res) {
        var self = this;

        var params = {
            id: tweetingAtId, //person you are tweeting at
            text: text
        }

        T.post('statuses/retweet/:id', params, gotData);

        function gotData(err, data, response) {
            if (err) return callback(err);
            console.log('data', data);
            console.log('response', response);
        }
    };

    var getFollowers = function(userName, res) {
        var self = this;

        //{ user_id: userName } // also can use user_id

        T.get('followers/ids', { username: userName }, gotData);

        function gotData(err, data, response) {
            if (err) return callback(err);
            console.log('data', data);
            console.log('response', response);
        }
    };

    var userSuggestions = function(searchText, res) {
        var self = this;

        T.get('followers/ids', { slug: searchText }, gotData);

        function gotData(err, data, response) {
            if (err) return callback(err);
            console.log('data', data);
            console.log('response', response);
        }
    };

    var deleteTweet = function(tweetId, res) {
        var self = this;

        T.post('statuses/destroy/:id', { id: tweetId }, gotData);

        function gotData(err, data, response) {
            if (err) return callback(err);
            console.log('data', data);
            console.log('response', response);
        }
    };

    //
    // favorite a tweet
    //
    var favorite = function(params, callback) {
        var self = this;

        T.get('search/tweets', params, gotTweets);

        function gotTweets(err, data) {
            if (err) return callback(err);

            var tweets = reply.statuses;
            var randomTweet = randIndex(tweets);
            if (typeof randomTweet != 'undefined')
                self.twit.post('favorites/create', { id: randomTweet.id_str }, callback);
        }
    };

    //
    //  choose a random friend of one of your followers, and follow that user
    //
    var mingle = function(callback) {
        var self = this;

        T.get('followers/ids', gotFollowers);

        function gotFollowers(err, data) {
            if (err) { return callback(err); }

            var followers = data.ids,
                randFollower = randIndex(followers);

            T.get('friends/ids', { user_id: randFollower }, randoFriended);

            function randoFriended(err, data) {
                if (err) { return callback(err); }

                var friends = data.ids,
                    target = randIndex(friends);

                T.post('friendships/create', { id: target }, callback);
            }
        }
    };

    var functions = {
        getTweets: getTweets,
        tweet: tweet,
        tweetAt: tweetAt,
        getFollowers: getFollowers,
        userSuggestions: userSuggestions,
        deleteTweet: deleteTweet
    };

    return functions;
}();

module.exports = TwitterSpace;