'use strict';
var config = require('../../config.js');
var Twit = require('Twit');
var _ = require('lodash');
var hashtagArray = [];
//
/////  https://github.com/ttezel/twit
//


module.exports = function(config) {
    var self = this;
    self.Twit = new Twit(config.twit());

    return {
        searchHastag: function(searchText, count, searchedHashTags, res) {
            var params = {
                q: '#' + searchText,
                count: count
            }

            console.log('search text: ' + searchText)

            self.Twit.get('search/tweets', params, gotData);

            function gotData(err, data, response) {
                if (err) return console.log(err);
                var tweets = data.statuses;


                var index = -1;
                for (var i = 0, len = searchedHashTags.length; i < len; i++) {
                    if (searchedHashTags[i].hashTag === searchText) {
                        index = i;
                        break;
                    }
                }

                searchedHashTags[index].tweets = tweets;

                searchedHashTags[index].tweets.forEach(function(tweet) {
                    var hashArr = (tweet.text.match(/#(\w+)/g));

                    hashArr.forEach(function(h) {
                        hashtagArray.push(h);
                    });

                }, this);
                var uniqHashes = [];

                _.uniq(hashtagArray).forEach(function(ht) {
                    uniqHashes.push(ht.toLowerCase());
                });

                hashtagArray = [];
                console.log(_.uniq(uniqHashes));

                res.render('pages/search', {
                    seachCriteria: searchText,
                    items: searchedHashTags,
                    siblingTags: uniqHashes
                });

            }
        }

    }

    function matchInArray(string, expressions) {

        var len = expressions.length,
            i = 0;

        for (; i < len; i++) {
            if (string.match(expressions[i])) {
                return true;
            }
        }

        return false;

    };

}



// TwitterBot.prototype.tweet = function(text, res) {
//     var self = this;

//     if(typeof status !== 'string') {
//         return callback(new Error('tweet must be of type String'));
//     } else if(status.length > 140) {
//         return callback(new Error('tweet is too long: ' + status.length));
//     }

//     self.T.post('statuses/update', { text: text }, gotData);

//     function gotData(err, data, response) {
//         if(err) return callback(err);
//             console.log('data',data);
//             console.log('response',response);
//     }
// }

// TwitterBot.prototype.tweetAt = function(text, tweetingAtId, res) {
//     var self = this;

//     var params = {
//         id: tweetingAtId, //person you are tweeting at
//         text: text
//     }

//     T.post('statuses/retweet/:id', params, gotData);

//     function gotData(err, data, response) {
//         if(err) return callback(err);
//             console.log('data',data);
//             console.log('response',response);
//     }
// }

// TwitterBot.prototype.getFollowers = function(userName, res) {
//     var self = this;

//     //{ user_id: userName } // also can use user_id

//     T.get('followers/ids', { username: userName }, gotData);

//     function gotData(err, data, response) {
//         if(err) return callback(err);
//             console.log('data',data);
//             console.log('response',response);
//     }
// }

// TwitterBot.prototype.userSuggestions = function(searchText, res) {
//     var self = this;

//     T.get('followers/ids', { slug: searchText }, gotData);

//     function gotData(err, data, response) {
//         if(err) return callback(err);
//             console.log('data',data);
//             console.log('response',response);
//     }
// }

// TwitterBot.prototype.userSuggestions = function(tweetId, res) {
//     var self = this;

//     T.post('statuses/destroy/:id', { id: tweetId }, gotData);

//     function gotData(err, data, response) {
//         if(err) return callback(err);
//             console.log('data',data);
//             console.log('response',response);
//     }
// }

// //
// // favorite a tweet
// //
// TwitterBot.prototype.favorite = function (params, callback) {
//     var self = this;

//     self.twit.get('search/tweets', params, gotTweets);

//     function gotTweets(err, data) {
//         if(err) return callback(err);

//         var tweets = reply.statuses;
//         var randomTweet = randIndex(tweets);
//         if(typeof randomTweet != 'undefined')
//             self.twit.post('favorites/create', { id: randomTweet.id_str }, callback);
//     }
// };

// //
// //  choose a random friend of one of your followers, and follow that user
// //
// TwitterBot.prototype.mingle = function (callback) {
// var self = this;

// this.twit.get('followers/ids', gotFollowers);

//     function gotFollowers(err, data) {
//         if(err) { return callback(err); }

//         var followers = data.ids
//             , randFollower  = randIndex(followers);

//         self.twit.get('friends/ids', { user_id: randFollower }, randoFriended);

//         function randoFriended(err, data){
//             if(err) { return callback(err); }

//             var friends = data.ids
//                 , target  = randIndex(friends);

//             self.twit.post('friendships/create', { id: target }, callback); 
//         }
//     }
// };

// function randIndex (arr) {
//     var index = Math.floor(arr.length*Math.random());
//     return arr[index];
// };