/* Required Constants */
const Request       = require('request');
const System        = require('systeminformation');
const Util          = require('util');
const Debug         = process.env.ODN_DEBUG;
const Inspect       = Util.inspect;
const moment        = require('moment');

const Config  = require('../config/config');

const sublevel = require('../helpers/sublevel');
const usermock = require('../helpers/usermock');
const trello = require('../helpers/trello');

const debug = require('debug')('api-common');

var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: true });

/* Internal Vars */

/* Debug Methods */
let inspectLog = (varX) => {
  if (Debug == false || Debug == 'false') { return; }
  console.log(Inspect(varX, {showHidden: false, depth: null}));
};

/* Internal Methods */

module.exports = {
  postFeedback: (req, res, next) => {
    debug('postFeedback');
    debug(req.body);

    let feedback = req.body;

    if (feedback.type === '') {
      return res.json({
        status: 'error',
        error: {
          field: 'type',
          message: 'Missing feedback type'
        }
      });
    }
    else if (feedback.body === '') {
      return res.json({
        status: 'error',
        error: {
          field: 'body',
          message: 'Body is empty'
        }
      });
    }

    let cardDetails = {
      pos: 'top',
      due: null,
      idList: feedback.type,
      idLabels: '5ab3040e16912f17ff96b2e0'
    };

    if (feedback.subject !== '') {
      cardDetails.name = feedback.subject;
      cardDetails.desc = feedback.body;
    }
    else {
      cardDetails.name = feedback.body;
    }

    trello.postNewCard(cardDetails)
    .then((newCard) => {
      debug('POST newCard');
      debug(newCard);
      res.json({ status: 'ok', card: newCard });
    }, (err) => {
      let errMessage = (err.message) ? err.message : err;
      debug(err);
      res.json({ status: 'error', message: errMessage });
    });
  },

  feedbackOptions: (req, res, next) => {
    trello.getBoardLists(Config.faq_board)
    .then((boardLists) => {
      res.json({ status: 'ok', options: boardLists });
    }, (err) => {
      // if (err.message) { return console.log('ERROR -- ' + err.message); }
      console.log(err);
      res.json({ status: 'error' });
    });
  },

  populate: (req, res, next) => {
    var cuid = require('cuid');

    var user = {
      name:   usermock.name(),
      id:     cuid(),
      email:  usermock.email(),
    };

    sublevel.users.put(user.id, user, function() {
      for(var i = 1 ; i <= 20; i ++) {
        var userMessages = sublevel.messages.sublevel(user.id);
        userMessages.put(cuid(), {
          from: user.id,
          body: `${usermock.message()}`,
          time: usermock.timestamp()
        });
      }

      res.json(user);
    });
  },

  fetchUser: (req, res, next) => {
    debug('fetching user...');
    let userId = (req.params.userId) ? req.params.userId : null;

    sublevel.users.get(userId, function(err, user) {
      if (err) return res.json({ status: 'error', err: err.message });
      console.log('User: %j', user);

      // var userMessages = sublevel.messages.sublevel(userId);
      // userMessages.createValueStream().on('data', function(message) {
      //   console.log('Message: %j', message);
      // })
      // .once('end', function() {
      //   console.log('no more messages');
      // });

      let arrMessages = [];
      var userMessages = sublevel.messages.sublevel(userId);
      userMessages.createReadStream()
      .on('data', (data) => {
        console.log('stream data', data);
        arrMessages.push(data.value);
      })
      .on('error', (err) => {
        console.log('error stream', err);
        res.json({ status: 'error', error: err });
      })
      .on('close', () => {
        console.log('closed stream');
        inspectLog(arrMessages);
      })
      .on('end', () => {
        console.log('stream ended');
        arrMessages.sort((a, b) => {
          let keyA = new Date(a.time),
              keyB = new Date(b.time);

          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });
        res.json({ status: 'ok', id: userId, messages: arrMessages });
      });
    });
  },

  fetchUsers: (req, res, next) => {
    debug('fetching users...');
    let arrUsers = [];
    sublevel.users.createReadStream()
    .on('data', (data) => {
      console.log('stream data', data);
      arrUsers.push(data.value);//[data.key] = data.value;
      // arrUsers[data.key] = data.value
    })
    .on('error', (err) => {
      console.log('error stream', err);
      res.json({ status: 'error', error: err });
    })
    .on('close', () => {
      console.log('closed stream');
      inspectLog(arrUsers);
      // res.json({ users: arrUsers });
    })
    .on('end', () => {
      console.log('stream ended');
      res.json({ status: 'ok', users: arrUsers });
    });
  },

  fetchMessages: (req, res, next) => {
    debug('fetching messages...');
    let arrMessages = [];
    sublevel.base.createValueStream()
    .on('data', (data) => {
      console.log('stream data', data);
      arrMessages.push(data);//[data.key] = data.value;
      // arrUsers[data.key] = data.value
    })
    .on('error', (err) => {
      console.log('error stream', err);
      res.json({ status: 'error', error: err });
    })
    .on('close', () => {
      console.log('closed stream');
      inspectLog(arrMessages);
      // res.json({ users: arrUsers });
    })
    .on('end', () => {
      console.log('stream ended');
      res.json({ status: 'ok', messages: arrMessages });
    });
  },

  deleteUsers: (req, res, next) => {
    console.log('deleting users...');
    let arrUsers = [];

    sublevel.users.createKeyStream()
    .on('data', (user_key) => {
      console.log(`==> USER :: ${user_key}`);
      console.log('...removing messages');

      let arrMessageKeys = [];
      var userMessages = sublevel.messages.sublevel(user_key);
      userMessages.createKeyStream()
      .on('data', (msg_key) => {
        console.log(`-- MSG FOUND :: ${msg_key}`);
        arrMessageKeys.push(msg_key);
      })
      .on('error', (err) => {
        console.log('error stream', err);
        return res.json({ status: 'error', error: err });
      })
      .on('close', () => {
        console.log('_closed stream msg');
      })
      .on('end', () => {
        console.log(`-- // End of Message Stream --`);
        console.log(`-- KILL USER HERE --`);

        let batchOps = [];
        for(let mKey of arrMessageKeys) {
          batchOps.push({ type: 'del', key: mKey });
        }

        console.log(`OPS:`, batchOps);

        sublevel.messages.batch(batchOps, (err) => {
          if (err) {
            console.log('error batch delete', err);
            return res.json({ status: 'error', error: err });
          }

          sublevel.users.del(user_key, (err) => {
            if (err) {
              console.log('error user delete', err);
              return res.json({ status: 'error', error: err });
            }

            console.log('%% DONE %%');
            arrUsers.push(user_key);

            console.log('KIA', arrUsers);
          });
        });
      });
    })
    .on('error', (err) => {
      console.log('error stream', err);
      res.json({ status: 'error', error: err });
    })
    .on('close', () => {
      console.log('_closed stream user');
    })
    .on('end', () => {
      console.log(`-- // End of User Stream --`);
      res.json({ status: 'okay', affected: arrUsers });
    });
  },

  createUser: (req, res, next) => {
    res.json({
      status: 'ok'
    });
  },

  systemInfo: (req, res, next) => {
    Promise.all([System.osInfo(), System.mem(), System.fsSize()])
    .then((_system) => {
      let _os   = _system[0];
      // platform - 'Linux', 'Darwin', 'Windows'
      // distro - os
      // release - os version

      let _mem  = _system[1];
      // total - total memory in bytes
      // free - not used in bytes
      // used - used (incl. buffers/cache)
      // active - used actively (excl. buffers/cache)
      // available - potentially available (total - active)

      let _fs   = _system[2];
      // [0].size - sizes in Bytes
      // [0].used - used in bytes
      // [0].use - used in %

      res.json({
        os: {
          platform: _os.platform,
          distro: _os.distro,
          release: _os.release
        },
        mem: {
          total: _mem.total,
          free: _mem.free,
          used: _mem.used,
          available: _mem.available
        },
        storage: {
          size: _fs[0].size,
          used: _fs[0].used,
          use: _fs[0].use
        }
      });
    }).catch(next);
  }
};
