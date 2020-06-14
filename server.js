 require('dotenv').config();

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	knex = require('./db/knex'),
	port = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/api/threads', (req,res) => {
	knex('threads').select('*').join(
		knex('comments').count('id').select('thread_id').groupBy('thread_id').as('replies'), 'replies.thread_id', '=', 'threads.id')
		.join('comments', 'comments.thread_id', '=', 'threads.id').where('head', true)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(500).send('Database Error'));
});

app.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});