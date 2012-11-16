/**
 * Module dependencies.
 */

var express = require('express')
  , routes = {}
  , http = require('http')
  , path = require('path')
  , fs   = require('fs')
  , passport = require('passport')
  , mongodb = require('mongodb');



/**********************************************************
*   Utility && setting
***********************************************************/
var dbHelper = require('./dbHelper');
var setting = require('./setting');

/**********************************************************
*   DB
***********************************************************/
global.db = require('./db');



/**********************************************************
*   Faceboo kLogin
***********************************************************/
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: setting.FB.APPID ,
    clientSecret: setting.FB.SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    dbHelper.userLoginUpsert(profile , done);  	
  }
));


passport.serializeUser(function(user, done) {  
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {  
  var profile = dbHelper.getUserDataByFBID(id , function(profile){
    done(null , profile);
  });  
});



/**********************************************************
*   Setting
***********************************************************/


var port = process.env.PORT || 3000;
var app = express();

app.configure(function(){  
  app.use(express.cookieParser());
  app.use(express.bodyParser());  
  app.use(express.static('views/'));
  app.use(express.session({ secret: 'mofas' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.set("view engine", "ejs");
});

/**********************************************************
*   Route
***********************************************************/


routes = require('./routes');
app.get( '/index.html', routes.list );
app.get( '/list', routes.list );
app.get( '/edit/:id?', routes.edit );
app.get( '/query/:id?', routes.query );

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/list',
                                      failureRedirect: '/loginFail.html' }));

app.get('/logout', function(req, res){
  	req.logout();
  	res.redirect('/list');
});

app.post( '/add', routes.add );
app.post( '/update/:id', routes.update );
app.post( '/delete/:id', routes.delete );
app.post( '/dropTable', routes.dropTable );

/**********************************************************
*   start server
***********************************************************/

var dbReady = function(){
  app.listen(port);  
}
db.connect(dbReady);
