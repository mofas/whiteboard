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
require('./utility');
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
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {  	  	

  	done(null, {id: profile.id , username : profile.username , displayName : profile.displayName});	
  	/**
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
	**/
  }
));


passport.serializeUser(function(user, done) {
  console.log("serial", user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("deserial", id);
  done(null ,id);
  /**
  User.findById(id, function(err, user) {
    done(err, user);
  });
  **/
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
                                      failureRedirect: '/list' }));




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
