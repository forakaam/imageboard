const environment = process.env.NODE_ENV,
	config = require('./knexfile.js')[environment];

module.exports = require('knex')(config);