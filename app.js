/**
 * Module dependencies.
 */

var express = require('express')
  , gzippo = require('gzippo')
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
*   Redis
***********************************************************/
global.redisClient = require('./redis');



/**********************************************************
*   Facebook Login
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
*   test Account Login
***********************************************************/
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, {id: "12345" , FB_id : "12345" , username : "testAccount" , displayName : "測試帳號"});        
  }
));




/**********************************************************
*   Setting
***********************************************************/


var port = process.env.PORT || 3000;
var app = express();

app.configure(function(){ 
  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.bodyParser());  
  app.use(express.static('views/'));
  /**
  // replace by express.compress
  app.use(gzippo.staticGzip('views/'));  
  **/
  app.use(express.session({ secret: 'mofas' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.set("view engine", "ejs"); 
  
});


/**********************************************************
*   Route
***********************************************************/

var routes = {};
routes.board = require('./routes/board');
routes.user = require('./routes/user');
routes.admin = require('./routes/admin');

var accessCheck = require('./routes/accessCheck');
var middleware = [accessCheck];

app.get( '/index.html', routes.board.list );
app.get( '/list', routes.board.list );
app.get( '/edit/:id?', middleware , routes.board.edit );
app.get( '/query/:id?',  middleware , routes.board.query );
app.get( '/user/query', routes.user.query );

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',  
  passport.authenticate('facebook', { 
    successRedirect: '/list',
    failureRedirect: '/loginFail.html' 
  })
);
app.get('/demoLogin', 
  passport.authenticate('local', { successRedirect: '/list',
    failureRedirect: '/loginFail.html' 
  })
);
app.get('/logout', function(req, res){
  	req.logout();
  	res.redirect('/list');
});

app.get('/admin/userList' , middleware , routes.admin.userList);

app.post( '/add', middleware , routes.board.add );
app.post( '/update/:id', middleware , routes.board.update );
app.post( '/delete/:id', middleware , routes.board.delete );
app.post( '/user/update', routes.user.update );

app.post( '/admin/adjustUserRole', middleware , routes.admin.adjustUserRole );






/**********************************************************
*   start server
***********************************************************/

var dbReady = function(){
  app.listen(port);  
}
db.connect(dbReady);
