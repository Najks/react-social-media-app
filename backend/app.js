var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var morgan = require('morgan'); 

// vključimo mongoose in ga povežemo z MongoDB
var mongoose = require('mongoose');
var mongoDB = "mongodb://127.0.0.1/react";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }); 
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB'); 
});

// vključimo routerje
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var photosRouter = require('./routes/photoRoutes');
var commentRouter = require('./routes/commentRoutes');

var app = express();

var cors = require('cors');
var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Vključimo session in connect-mongo.
 * Connect-mongo skrbi, da se session hrani v bazi.
 * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
 */
var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB})
}));
//Shranimo sejne spremenljivke v locals
//Tako lahko do njih dostopamo v vseh view-ih (glej layout.hbs)
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photosRouter);
app.use('/comments', commentRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;