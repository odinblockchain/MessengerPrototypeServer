// *** main dependencies *** //
let express       = require('express');
let path          = require('path');
let cookieParser  = require('cookie-parser');
var cookieSession = require('cookie-session')
let bodyParser    = require('body-parser');
let pjson         = require('./package.json');
var csrf          = require('csurf');

const debug = require('debug')('api-server');

// middleware setup
// var csrfProtection = csrf({ cookie: true });
// var parseForm = bodyParser.urlencoded({ extended: false });

// *** rootPath *** //
global.APP_ROOT = path.resolve(__dirname);

// *** routes *** //
let commonRoutes = require('./routes/common');

// *** express instance *** //
let app = express();

// *** apply middleware *** //
// app.use(logger('dev'));
app.use(cookieParser());
// app.use(cookieParser('secretPassword'));
// app.use(cookieSession({
//   name: 'xsession',
//   secret: 'secretPhrase',
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, CSRF-Token, X-XSRF-TOKEN");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

/* Configure bodyParser to handle data from POST/PUT */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var csrfProtection = csrf({ cookie: true });
app.use(csrf({ cookie: true }));
app.use(function(req, res, next) {
  debug(`URL::${req.url} [${req.method}]`);
  // debug(`--> Token::${newToken}\n--> Header::${req.headers['x-xsrf-token']}`);
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return next();
});

// *** main routes *** //
if (process.env.NODE_ENV === 'development') {
  app.use('/api', commonRoutes);
}
else {
  app.use('/api', commonRoutes);
}

// *** handle favicon request *** //
app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

// *** handle ping request *** //
app.get('/ping', function(req, res) {
  console.log('foo');
  process.stdout.write('foo2?');
  res.json({
    status: 'success',
    api_version: pjson.version
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      status: 'error',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: 'error',
    message: err.message,
    error: err
  });
});

console.log('lets go');

module.exports = app;
