var express = require('express');
var bodyParser = require('body-parser');
var contactController = require('./controllers/contactController')
var fs = require('fs');

var app = express();

//Template Engine
app.set('view engine', 'ejs');

//Statics
app.use('/assets', express.static('./public'));
app.use('/scripts', express.static('./scripts'));

//Listen to a port
app.listen(80);

//Fire Controllers
contactController(app);