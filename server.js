 require('dotenv').config();

const express = require('express'),
	app = express(),
	path = require('path'),
	multer = require("multer"),
	methodOverride = require('method-override'),
	knex = require('./db/knex'),
	fs = require('fs-extra'),
	filesize = require('filesize'),
	sizeOf = require('image-size'),
	imageThumbnail = require('image-thumbnail')
	port = process.env.PORT || 3000,
	charLimit = 500;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(methodOverride('_method'));

let curAddress = 99191104;
function fileFilter(req, file, cb) {
	let ext = path.extname(file.originalname);
	if (req.body.content) {
		if (req.body.content.length > 500) {
			req.error = `Posts are limited to ${charLimit} characters`;
			return cb(new Error(`Posts are limited to ${charLimit} characters`), false);
		}
	}
	if (ext !=='.png' && ext !== '.jpg' && ext !== 'jpeg' && ext !== '.gif') {
		return cb(new Error('Only jpegs, pngs, gifs are allowed'), false);
	}
	return cb(null, true);
};
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      	let threadId = req.params.id;
      	if (!threadId) {
      		threadId = 'temp';
      	}
      	let path = `./dist/images/${threadId}`;
      	fs.mkdirsSync(path);
      	callback(null, path);
    },
    filename: (req, file, callback) => {
      	callback(null, `(${curAddress + 1})${file.originalname}`);
    }
});
const limits = {
	fileSize: 1024 * 1024 * 3
};
const upload = multer({
	storage,
  	fileFilter,
  	limits
});

app.get('/api/threads', (req, res) => {
	knex('threads').select('posts.thread_id', 'image', 'name', 'address', 'images', 'subject', 'content', 'replies', 'created_at').join(
		knex('posts').count({ replies: 'id'}).count({images: knex.raw('case when image is not null then 1 end')})
		.select('thread_id').groupBy('thread_id').as('replies'), 'replies.thread_id', '=', 'threads.id')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('head', true)
	.then(data => res.json(data))
	.catch(err => res.status(500).send('Database Error'));
});

app.get('/api/threads/:id', (req, res) => {
	knex('threads').select('posts.id','thread_id', 'image', 'name', 'subject', 'content', 'created_at', 'archived', 'address')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('threads.id', req.params.id)
	.then(data => {
		data = data.map(item => {
			if (item.image) {
				let path = `./dist/images/${item.thread_id}/(${item.address})${item.image}`;
				let bytes = fs.statSync(path).size;
				item.filesize = filesize(bytes);
				item.dimensions = sizeOf(path);
			}
			return item;
		});
		res.json(data);
	})
	.catch(err => res.status(500).send(err));
});

app.post('/api/threads/new', upload.single('image'), (req, res) => {
	let {subject, content, thread, name} = req.body; 
	if (content.length > charLimit) {
		res.status(400).end();
	}
	else {
		let post = {
			content: content == 'undefined' ? '' : content,
			name,
			image: req.file ? req.file.originalname : null,
			created_at: new Date(),
			address: curAddress + 1
		};
		if (req.error) console.log(req.error)
		knex('threads').insert({subject}).returning('id').then(ids	=> {
			knex('posts').insert({thread_id: ids[0], head: true, ...post}).returning('thread_id').then(thread_ids => {
				curAddress++;
				if (req.file) {
					let path = `./dist/images/${thread_ids[0]}`;
					fs.mkdirsSync(path);
					fs.rename(`./dist/images/temp/(${curAddress})${req.file.originalname}`,`${path}/(${curAddress})${req.file.originalname}`);
					
					imageThumbnail(path)
					.then(thumbnail => {
						console.log(thumbnail)
						
					}).catch(err => console.log(err));
				}
				res.json(thread_ids[0]);
			}).catch(err => res.status(500).send(err));
		})
	}
});

app.post('/api/threads/:id/new', upload.single('image'), (req, res) => {
	let {subject, content, thread, name} = req.body; 
	if (content.length > charLimit) {
		res.status(400).end();
	}
	else {
		let post = {
			content: content == 'undefined' ? '' : content,
			name,
			image: req.file ? req.file.originalname : null,
			created_at: new Date(),
			address: curAddress + 1
		};
		knex('posts').insert({thread_id: thread, head: false, ...post}).then(resp => {
			curAddress++;
			res.status(201).end();

		}).catch(err => res.status(500).send(err));
	}
});

 app.get('*', (req, res) => {
 	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
 })
app.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});