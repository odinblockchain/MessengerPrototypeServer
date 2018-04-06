/* Libraries */
const Request = require("request");
const Config  = require('../config/config');

/* API Config */
const apiURL  = 'https://api.trello.com/1';
const key     = Config.auth_key;
const secret  = Config.auth_secret;

/* Boards */
const faqBoard = Config.faq_board;

let requestOpts = {
  qs: {
    key: key,
    token: secret
  }
};

let getBoardLists = (boardId) => {
  return new Promise((resolve, reject) => {
    requestOpts['method'] = 'GET';
    requestOpts['url'] = `${apiURL}/boards/${boardId}/lists`;

    Request(requestOpts, (error, response, body) => {
      if (error) return reject(new Error(error));

      try {
        return resolve(JSON.parse(body));
      } catch (err) { return reject(new Error('Unparsable -- ' + body)); }
    });
  });
};

let getBoardLabels = (boardId) => {
  return new Promise((resolve, reject) => {
    requestOpts['method'] = 'GET';
    requestOpts['url']    = `${apiURL}/boards/${boardId}/labels`;

    Request(requestOpts, (error, response, body) => {
      if (error) return reject(new Error(error));
      try {
        return resolve(JSON.parse(body));
      } catch (err) { return reject(new Error('Unparsable -- ' + body)); }
    });
  });
};

let postNewCard = (cardDetails) => {
  return new Promise((resolve, reject) => {
    requestOpts['method'] = 'POST';
    requestOpts['url']    = `${apiURL}/cards/`;
    requestOpts['form']   = cardDetails;

    Request(requestOpts, (error, response, body) => {
      if (error) return reject(new Error(error));
      try {
        return resolve(JSON.parse(body));
      } catch (err) { return reject(new Error('Unparsable -- ' + body)); }
    });
  });
};

module.exports = {
  getBoardLists: getBoardLists,
  postNewCard: postNewCard
};

// getBoardLists(faqBoard)
// .then((boardLists) => {
//   console.log('GOT Lists');
//   console.log(boardLists);
// }, (err) => {
//   if (err.message) { return console.log('ERROR -- ' + err.message); }
//   console.log(err);
// });

// getBoardLabels(faqBoard)
// .then((boardLabels) => {
//   console.log('GOT Labels');
//   console.log(boardLabels);
// }, (err) => {
//   if (err.message) { return console.log('ERROR -- ' + err.message); }
//   console.log(err);
// });

// let cardDetails = {
//   name: "Pete123",
//   desc: "Description 123",
//   pos: "top",
//   due: null,
//   idList: '5ab2a01a56f0ce4360419bd0',
//   idLabels: '5ab3040e16912f17ff96b2e0'
// };
//
// postNewCard(cardDetails)
// .then((newCard) => {
//   console.log('GOT Card');
//   console.log(newCard);
// }, (err) => {
//   if (err.message) { return console.log('ERROR -- ' + err.message); }
//   console.log(err);
// });
