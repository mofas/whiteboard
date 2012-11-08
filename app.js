/**
 * Module dependencies.
 */

var express = require('express')
  , routes = {}
  , http = require('http')
  , path = require('path')
  , fs   = require('fs')
  , mongodb = require('mongodb');


//utility helper
require('./utility');

/**********************************************
*  mongoDB
***********************************************/
global.db = require('./db');

/**********************************************************
*   start server
***********************************************************/


var port = process.env.PORT || 3000;
var app = express();

app.configure(function(){  
  app.use(express.bodyParser());  
  app.use(express.static('views/'));
  app.set("view engine", "ejs");
});


//設定route
routes = require('./routes');
app.get( '/index.html', routes.list );
app.get( '/list', routes.list );
app.get( '/edit/:id?', routes.edit );
app.get( '/query/:id?', routes.query );

app.post( '/add', routes.add );
app.post( '/update/:id', routes.update );
app.post( '/delete/:id', routes.delete );
app.post( '/dropTable', routes.dropTable );

var dbReady = function(){
  app.listen(port);  
}
db.connect(dbReady);
