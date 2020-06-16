 require('dotenv').config();

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	knex = require('./db/knex'),
	fs = require('fs'),
	filesize = require('filesize'),
	sizeOf = require('image-size'),
	port = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/api/threads', (req, res) => {
	knex('threads').select('posts.thread_id', 'image', 'images', 'title', 'content', 'replies', 'created_at').join(
		knex('posts').count({ replies: 'id'}).count({images: knex.raw('case when image is not null then 1 end')})
		.select('thread_id').groupBy('thread_id').as('replies'), 'replies.thread_id', '=', 'threads.id')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('head', true)
	.then(data => res.json(data))
	.catch(err => res.status(500).send('Database Error'));
});

app.get('/api/threads/:id', (req, res) => {
	knex('threads').select('posts.id','thread_id', 'image', 'title', 'content', 'created_at', 'archived', 'address')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('threads.id', req.params.id)
	.then(data => {
		data = data.map(item => {
			if (item.image) {
				let path = `./dist/images/${item.thread_id}/${item.image}`;
				let bytes = fs.statSync(path).size;
				item.filesize = filesize(bytes);
				item.dimensions = sizeOf(path);
			}
			return item;
		});
		res.json(data);
	})
	//.catch(err => res.status(500).send(err))
});

app.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});