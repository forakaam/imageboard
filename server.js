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
	imageThumbnail = require('image-thumbnail'),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
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
	files: 5,
	fileSize: 1024 * 1024 * 3
};
const upload = multer({
	storage,
  	fileFilter,
  	limits
});

io.on('connect', socket => {
	console.log('Client connected');
	socket.on('subscribe', threadID => {
		socket.join(threadID);
	});
	socket.on('unsubscribe', threadID => {
		socket.leave(threadID);
	});
});

io.on('disconect', () => {
	console.log('Client disconnected');
});

app.get('/api/threads', (req, res) => {
	knex('threads').select('id','subject').where('archived', false)
	.then(threads => {
		knex('posts').select('name', 'tripcode', 'address', 'content', 'id', 'created_at', 'thread_id', 'head').whereIn('thread_id', threads.map(thread => thread.id))
		.then(posts => {
			let post_ids = posts.map(post => post.id);
			knex('images').select('filename','post_id').whereIn('post_id', post_ids)
			.then(images => {
				knex('likes').select('IP','post_id').whereIn('post_id', post_ids)
				.then(likes => {
					let counts = {};
					let heads = {};
					threads.forEach(thread => {
						counts[thread.id] = {replies: 0, images: 0}
					});
					for (let i = 0; i < posts.length; i++) {
						counts[posts[i].thread_id].replies++;
						if (posts[i].head) {
							heads[posts[i].thread_id] = posts[i];
						}
					}
					for (let j = 0; j < images.length; j++) {
						let post = posts.find(post => post.id == images[j].post_id);
						counts[post.thread_id].images++;
						if (post.head) {
							if (!heads[post.thread_id].images) {
								heads[post.thread_id].images = [];
							}
							heads[post.thread_id].images.push(images[j]);
						}
					}
					for (let k = 0; k < likes.length; k++) {
						let post = posts.find(post => post.id == likes[k].post_id);
						if (!post.likes) {
							post.likes = 1;
						}
						else {
							post.likes++;
						}
						if (likes[k].IP == req.ip) {
							post.wasLiked = true;
						}
					}
					res.json({threads, counts, heads});
				});
			});
		});
	})
	.catch(err => res.status(500).send('Database Error'));
});

app.get('/api/threads/:id', (req, res) => {
	knex('threads').select('posts.id','thread_id', 'name', 'subject', 'content', 'tripcode', 'created_at', 'archived', 'address', 'uid')
	.join('posts', 'posts.thread_id', '=', 'threads.id').where('threads.id', req.params.id).orderBy('posts.id')
	.then(posts => {
		let post_ids = posts.map(post => post.id);
		knex('images').select('id', 'filename', 'filesize', 'width', 'height', 'post_id').whereIn('post_id',post_ids).then(images => {
			knex('likes').select('IP','post_id').whereIn('post_id', post_ids)
			.then(likes => {
				for (let i = 0; i < images.length; i++) {
					let j = posts.findIndex(post => post.id == images[i].post_id);
					if (!posts[j].images) {
						posts[j].images = [];
					}
					posts[j].images.push({
						filename: images[i].filename, 
						filesize: images[i].filesize, 
						width: images[i].width, 
						height: images[i].height});
					images[i].address = posts[j].address
				}
				for (let j = 0; j < likes.length; j++) {
					let post = posts.find(post => post.id == likes[j].post_id);
					if (!post.likes) {
						post.likes = 1;
					}
					else {
						post.likes++;
					}
					if (likes[j].IP == req.ip) {
						post.wasLiked = true;
					}
				}
	
				res.json({posts,images});
			});
			
		});	
	})
	.catch(err => res.status(500).send(err));
});

app.post('/api/threads/new', upload.array('images', 5), (req, res) => {

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
			created_at: new Date(),
			IP: req.ip,
			tripcode: hash,
			address: curAddress + 1,
			uid: newId()
		};
		knex('threads').insert({subject, archived: false}).returning('id').then(thread_ids	=> {
			knex('posts').insert({thread_id: thread_ids[0], head: true, ...post}).returning('id').then(post_ids => {
				curAddress++;
				if (req.files.length > 0) {
					let count = 0;
					let folder = `./dist/images/${thread_ids[0]}`;
					fs.mkdirsSync(folder);
					for (let i = 0; i < req.files.length; i++) {
						let path = `${folder}/(${curAddress})${req.files[i].originalname}`
						fs.renameSync(`./dist/images/temp/(${curAddress})${req.files[i].originalname}`, path);
						imageThumbnail(path)
						.then(thumbnail => {
							let thumbPath  =`${folder}/thumb(${curAddress})${req.files[i].originalname}.jpg`;
							fs.writeFileSync(thumbPath, thumbnail);
							let image = {
								filename: req.files[i].originalname,
								post_id: post_ids[0]
							}
							let bytes = req.files[i].size;
							image.filesize = filesize(bytes);
							let dimensions = sizeOf(path);
							image.height = dimensions.height;
							image.width = dimensions.width;
							knex('images').insert(image).returning('id').then(image_ids => {
								count++;
								if (count == req.files.length) {
									res.json(thread_ids[0]);
								}
							}); 
						});
					}
				}
				else {
					res.json(thread_ids[0]);
				}
			}).catch(err => res.status(500).send(err));
		})
	}
});

app.post('/api/threads/:id/new', upload.array('images', 5), (req, res) => {
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
				created_at: new Date(),
				address: curAddress + 1
			};
			knex('posts').insert(post).returning('id').then(post_ids => {
				curAddress++;
				if (req.files.length > 0) {
					post.images = [];
					for (let i = 0; i < req.files.length; i++) {
						let path = `./dist/images/${req.params.id}/(${curAddress})${req.files[i].originalname}`;
						imageThumbnail(path)
						.then(thumbnail => {
							let thumbPath  =`./dist/images/${req.params.id}/thumb(${curAddress})${req.files[i].originalname}.jpg`;
							fs.writeFile(thumbPath, thumbnail);
							let image = {
								filename: req.files[i].originalname,
								post_id: post_ids[0]
							}
							let bytes = req.files[i].size;
							image.filesize = filesize(bytes);
							let dimensions = sizeOf(path);
							image.height = dimensions.height;
							image.width = dimensions.width;
							knex('images').insert(image).returning('id').then(image_ids => {
								post.images.push(image)
								if (post.images.length == req.files.length) {
									io.to(req.params.id).emit('new post', post);
									res.status(201).end();
								}
							}); 
			
						});
					}

				} 
				else {
					io.to(req.params.id).emit('new post', post);
					res.status(201).end();
				}

			})
		})
		// .catch(err => res.status(500).send(err));
	}
});
app.post('/api/threads/:thread_id/posts/:post_id/like', (req, res) => {
	let like = {
		post_id: req.params.post_id, 
		IP: req.ip
	};
	knex('likes').select('*').where(like).then(likes => {
		if (likes.length == 0) {
			knex('likes').insert(like).returning('id').then(id => {
				res.status(201).end();
			})
		}
		else {
			res.status(500).end();
		}
	}).catch(err => res.status(500).send(err));
});
app.delete('/api/threads/:thread_id/posts/:post_id/like', (req, res) => {
	let like = {
		post_id: req.params.post_id, 
		IP: req.ip
	};
	knex('likes').where(like).del().returning('id').then(likes => {
		res.status(201).end();
	}).catch(err => res.status(500).send(err));
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

server.listen(port, () => {
	console.log(`Serving on port ${port}...`);
});