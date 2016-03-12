var express = require('express');
var assert = require('assert');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = module.exports = express();
var path = require('path');
var mongoose = require('mongoose');


//Database for todos...we'll use mongoose as the abstraction layer for MongoDB.
//mongoose models are stored in ./api/models, one model per file
mongoose.connect('mongodb://localhost/mean_todo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

var models = require('./api/models');


//var users = monk('localhost/users');
var session = require('express-session');

/*
 Use config.json to get app params; this will also be used
 as an API to provide config to frontend (only interested in server params right now,
 even though config.json reads the environment also )

 */
var serverParams = require('config.json')('./config/serverConfig.json');
app.set('serverParams', serverParams.server);


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//angular files are in the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//todo: how is the session secret used?
app.use(session({secret: serverParams.server.sessionSecret}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

console.log('Loaded OAUTH keys');


//Set up Passport for Twitter login
//todo: move this into a module
var passport = require('passport');
TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
        consumerKey: serverParams.oauth.TWITTER_CONSUMER_KEY,
        consumerSecret: serverParams.oauth.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://" + serverParams.server.host + ":" + serverParams.server.port + "/todo/auth/callback"
    },
    function (token, tokenSecret, profile, done) {
        console.log("Got Twitter user: " + profile.displayName);
        //create new user record
        var theUser = new models.Users({name: profile.displayName, isLoggedIn: true});
        //and add to db
        db.insert(theUser, function (err, theUser) {
            if (err) {
                return done(err);
            }
        });
        this.redirect("http://localhost:8080");
//        done(null, profile);
//        users.insert(profile.name, function(err, user) {
//            if (err) { return done(err); }
//            done(null, user);
//        });
    }
));
app.use(passport.initialize());
app.use(passport.session());

var io = require('socket.io')(server);

// Auto load all controllers for the application [from forked code]
//This is actually a nice approach...no need to require them individually
//
fs.readdirSync('./api/controllers').forEach(function (file){
	if (file.substr(-3) === ".js"){
		route = require('./api/controllers/' + file);
        route.controller(app, db, passport, models);
	}
});

var server = app.listen(serverParams.server.port);
