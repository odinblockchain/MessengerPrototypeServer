// *** main dependencies *** //
let express   = require('express');
let app       = express();
let api       = require('./api');
let appPort   = normalizePort(process.env.PORT || 4200);

// *** local vars *** //
let public_path = `${__dirname}/web/dist`
let webapp_path = `${public_path}/index.html`
let server = {};

// *** local methods *** //

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  let port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) { return val; }

  // port number
  if (port >= 0) { return port; }

  return false;
}

// *** setup api + webapp *** //
app.use('/api', api);
app.use(express.static(public_path));

app.get('*', function(req, res) {
  res.sendFile(webapp_path);
});

server = app.listen(appPort, () => {
  let addr = server.address();
  if (typeof addr === 'object') {
    addr = `${addr.address}:${addr.port}`;
  }

  console.log(`Server Listening on ${addr}`);
});

// *** expose server *** //
exports = module.exports = app;
