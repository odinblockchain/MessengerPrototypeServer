const fs = require('fs');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = JSON.parse(fs.readFileSync(__dirname + `/${NODE_ENV}.json`));
