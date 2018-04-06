var level     = require('level');
var path      = require('path');
var sublevel  = require('level-sublevel');

var dbPath = process.env.DB_PATH || path.join(APP_ROOT, 'db/contacts');
var db = sublevel(level(dbPath, {
  valueEncoding: 'json'
}));

db.on('put', function (key, value) {
  console.log('inserted', { key, value })
});

db.on('del', function (key) {
  console.log('deleted', key);
});

db.on('open', function () {
  console.log('opened db');
});

db.on('closed', function () {
  console.log('closed db');
});


module.exports = {
  base: db,
  users: db.sublevel('users'),
  messages: db.sublevel('messages')
};
