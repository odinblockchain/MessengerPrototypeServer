#!/usr/bin/env node
const { exec }  = require('child_process');
const Port      = process.env.PORT || 4201;
const NodeEnv   = process.env.NODE_ENV || 'development';

console.log(`:// MessengerPrototypeServer [Starting] ... Listening on :${Port}`);
console.log('-- This is an active process, use ^C to terminate --');
exec(`NODE_ENV=${NodeEnv} PORT=${Port} node ./bin/www`);
