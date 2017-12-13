// var TwitterBot = require('../public/scripts/TwitterBotMethods.js');
// var config = require('../config');

// var TwitBot = new TwitterBot(config);
// function MainController(app) {
//     this.app = app;
//     this.Twit = new TwitterBot(config);
//     this.routeTable = [];
//     this.init();
    
// }

// MainController.prototype.init = function () {

//     var self = this;
//     this.addRoutes();
//     this.processRoutes();
// }

// MainController.prototype.addRoutes = function () {
//     var self = this;
    
//     self.routeTable.push({
//         requestType: 'get',
//         requestUrl: '/',
//         callbackFunction: function (req, res) {
//             res.render('/pages/index.ejs', { title: "Search Twitter"})
//         }
//     });

//     self.routeTable.push({
//         requestType: 'get',
//         requestUrl: '/searchTwitter',
//         callbackFunction: function (req, res) {
//             res.render('pages/searchTwitter', { title: "Search Twitter"})
//         }
//     });
// }
// MainController.prototype.processRoutes = function() {
//     var self = this;
    
//     self.routeTable.forEach(function(route) {        
//         if (route.requestType == 'get') {
//             console.log(route);
//             self.app.get(route.requestUrl, route.callbackFunction)
//         } else if (route.requestType == 'post') {

//         } else if (route.requestType == 'delete') {

//         }
//     });
// }


// module.exports = MainController;