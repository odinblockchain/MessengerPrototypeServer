/* Required Constants */
const Express   = require('express');
const Router    = Express.Router();
const Common    = require('../controllers/common');
var csrf        = require('csurf');
var bodyParser  = require('body-parser');

// middleware setup
var csrfProtection  = csrf({ cookie: true });
var parseForm       = bodyParser.urlencoded({ extended: false })

/* Routes Accessible */
Router.get('/system', Common.systemInfo);
Router.post('/feedback-submit', parseForm, csrfProtection, Common.postFeedback);
Router.get('/feedback-options', Common.feedbackOptions);
// Router.get('/create', Common.createUser);
// Router.get('/populate', Common.populate);
// Router.get('/fetch-user/:userId?', Common.fetchUser);
// Router.get('/fetch-users', Common.fetchUsers);
// Router.get('/fetch-messages', Common.fetchMessages);
// Router.get('/delete-users', Common.deleteUsers);

module.exports = Router;
