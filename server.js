 require('dotenv').config();

const express = require('express'),
	app = express(),
	path = require('path'),
	multer = require("multer"),
	methodOverride = require('method-override'),
	knex = require('./db/knex'),
	fs = require('fs-extra'),
	bcrypt = require('bcrypt'),
	filesize = require('filesize'),
	sizeOf = require('image-size'),
	imageThumbnail = require('image-thumbnail')
	port = process.env.PORT || 3000,
	charLimit = 500,
	saltRounds = 10;

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
	knex('threads').select('posts.thread_id', 'image', 'name', 'address', 'tripcode', 'images', 'subject', 'content', 'replies', 'created_at', 'uid').join(
		knex('posts').count({ replies: 'id'}).count({images: knex.raw('case when image is not null then 1 end')})
		.select('thread_id').groupBy('thread_id').as('replies'), 'replies.thread_id', '=', 'threads.id')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('head', true)
	.then(data => res.json(data))
	.catch(err => res.status(500).send('Database Error'));
});

app.get('/api/threads/:id', (req, res) => {
	knex('threads').select('posts.id','thread_id', 'image', 'name', 'subject', 'content', 'tripcode', 'created_at', 'archived', 'address', 'uid')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('threads.id', req.params.id)
	.then(data => {
		data = data.map(item => {
			if (item.image) {
				let path = `./dist/images/${item.thread_id}/(${item.address})${item.image}`;
				let options = {
					percentage: 10,
					jpegOptions: {force: true}
				}
				let dimensions = sizeOf(path);
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

	let {subject, content, name} = req.body;
	let tripcode = /(.*)#(.*)/;
	let hash = null; 
	if (content.length > charLimit) {
		res.status(400).end();
	}
	else {
		if (name && name.match(tripcode)) {
			let matches = name.match(tripcode);
			hash = bcrypt.hashSync(matches[2], saltRounds).substring(40,60).replace(/\./g,'я');
			name = matches[1];
		}
		let post = {
			content: content == 'undefined' ? '' : content,
			name,
			image: req.file ? req.file.originalname : null,
			created_at: new Date(),
			IP: req.ip,
			tripcode: hash,
			address: curAddress + 1,
			uid: newId()
		};
		knex('threads').insert({subject}).returning('id').then(ids	=> {
			knex('posts').insert({thread_id: ids[0], head: true, ...post}).returning('thread_id').then(thread_ids => {
				curAddress++;
				if (req.file) {
					let path = `./dist/images/${thread_ids[0]}`;
					fs.mkdirsSync(path);
					fs.renameSync(`./dist/images/temp/(${curAddress})${req.file.originalname}`,`${path}/(${curAddress})${req.file.originalname}`);
					imageThumbnail(`${path}/(${curAddress})${req.file.originalname}`)
					.then(thumbnail => {
						let thumbPath  =`${path}/thumb(${curAddress})${req.file.originalname}.jpg`;
						fs.writeFileSync(thumbPath, thumbnail);
						res.json(thread_ids[0]);
					})
				}
				else {
					res.json(thread_ids[0]);
				}
			}).catch(err => res.status(500).send(err));
		})
	}
});

app.post('/api/threads/:id/new', upload.single('image'), (req, res) => {
	let {subject, content, name} = req.body; 
	let tripcode = /(.*)#(.*)/;
	let hash = null; 
	if (content.length > charLimit) {
		res.status(400).end();
	}
	else {
		if (name && name.match(tripcode)) {
			let matches = name.match(tripcode);
			hash = bcrypt.hashSync(matches[2], saltRounds).substring(40,60).replace(/\./g,'я')
;
			name = matches[1];
		}
		knex('posts').where({IP: req.ip, thread_id: req.params.id}).select('uid').first().then(match => {
			let post = {
				content: content == 'undefined' ? '' : content,
				name,
				thread_id: req.params.id,
				head: false,
				tripcode: hash,
				uid: match ? match.uid : newId(),
				IP: req.ip,
				image: req.file ? req.file.originalname : null,
				created_at: new Date(),
				address: curAddress + 1
			};
			knex('posts').insert({...post}).then(resp => {
				curAddress++;
				if (req.file) {
					imageThumbnail(`./dist/images/${req.params.id}/(${curAddress})${req.file.originalname}`)
					.then(thumbnail => {
						let thumbPath  =`./dist/images/${req.params.id}/thumb(${curAddress})${req.file.originalname}.jpg`;
						fs.writeFile(thumbPath, thumbnail);
					})
				}
				res.status(201).end();

			})
		})
		// .catch(err => res.status(500).send(err));
	}
});

function newId(){
	let length = 8;
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	let id = '';
	for (let i = 0; i < length; i++){
		id += chars[Math.floor(Math.random() * chars.length)];
	}
	return id;
}
 app.get('*', (req, res) => {
 	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
 })
app.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});