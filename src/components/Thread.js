import React, {Component} from 'react';
import io from "socket.io-client";
import Header from './Header';
import Post from './Post';
import Form from './Form';
import Gallery from './Gallery';
import '../styles/thread.css';

class Thread extends Component {
	constructor(props) {
		super(props);
		this.state = {
			images: [],
			isLoaded: false,
			posts: [],
			error: null,
			current: '',
			showGallery: false,
			formLink: ''
		}
		this.socket = io('http://localhost:8080');
		this.toggleGallery = this.toggleGallery.bind(this);
		this.changeImage = this.changeImage.bind(this);
		this.linkReply = this.linkReply.bind(this); 
		this.linkForm = this.linkForm.bind(this); 
		this.highlight = this.highlight.bind(this);
		this.thread = this.thread.bind(this);
		this.markUsersPosts = this.markUsersPosts.bind(this);
		this.hidePost = this.hidePost.bind(this);
		this.changeSort = this.changeSort.bind(this);
	}
	changeSort(sort){
		let {posts} = this.state;
		helper(posts);
		this.setState(posts);
		function helper(arr) {
			if (sort == 'byID') {
				arr.sort(byID);
			}
			else if (sort == 'byLikes') {
				arr.sort(byLikes);
			}
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].children) {
					helper(arr[i].children)
				}
			}
		}
		function byID(prev, cur) {
			if (prev.id < cur.id) {
				return -1;
			}
			else if (prev.id == cur.id) {
				return 0;
			}
			else {
				return 1;
			}
		}
		function byLikes(prev, cur) {
			if (!prev.likes) {
				prev.likes = 0;
			}
			if (!cur.likes) {
				cur.likes = 0;
			}
			if (prev.likes > cur.likes) {
				return -1
			}
			else if (prev.likes == cur.likes) {
				return 0;
			}
			else {
				return 1;
			}
		}
	}
	componentDidMount() {
		const {id} = this.props.match.params;

		fetch(`/api/threads/${id}`)
		.then(res => res.json())
		.then(data => {
			this.setState({
				posts: data.posts, 
				isLoaded: true, 
				images: data.images
			})
		}).catch(error => this.setState({error}));


		this.socket.on('connect', (test) => {
			this.socket.emit('subscribe',id)
			this.socket.on('new post', post => {
				let {images, posts} = this.state;
				console.log(post);
				posts.push(post);
				if (post.image) {
					images.push({
						filename: post.image, 
						address: post.address,
						dimensions: post.dimensions,
						filesize: post.filesize
					});
				}
				this.setState({images, posts});
 			});
		});
	}
	countPosts(posts){
		let users = [];
		let counts = {
			images: 0,
			posts: 0,
			users: 0
		}
		helper(posts);
		return counts;
		function helper(arr) {
			for (let i = 0; i < arr.length; i ++) {
				counts.posts ++;
				if (arr[i].images) {
					counts.images += arr[i].images.length;
				}
				if (!users.includes(arr[i].uid)){
					users.push(arr[i].uid);
					counts.users ++;
				}
				if (arr[i].children){
					helper(arr[i].children);
				}
			}

		}
	}
	componentWillUnmount() {
		this.socket.emit('unsubscribe', this.props.match.params);
	}
	render() {
		const {isLoaded, error, posts, showGallery, current, images, formLink} = this.state
		let head = posts[0];
		let counts = this.countPosts(posts);
		if (error) {
			return <div>Error: {error}</div>
		}
		else if (!isLoaded) {
			return <div>Loading ... </div>
		}
		else if (head) {
			let users = {};
			this.countUsersPosts(posts, users);
			return (
				<div>
					<Header toggleGallery={this.toggleGallery} counts={counts} changeSort={this.changeSort}/>
					<h2>{head.subject}</h2>
					{head.archived && <span>archived icon</span>}
					{this.threadPosts(posts, users)}
					<Form thread_id={head.thread_id} link={formLink} linkForm={this.linkForm}/>
					{showGallery && <Gallery 
						images={images} 
						current={current} 
						thread_id={head.thread_id} 
						changeImage={this.changeImage} 
						toggleGallery={this.toggleGallery}/>}
				</div>
			)
		}
		else  {
			return <div>404: Not Found</div>
		}
	}
	threadPosts(posts, users) {
		return posts.map(post => {
			return  (
				<div key={'post' + post.id}>
					<Post  
						{...post} 
						linkReply={this.linkReply.bind(this, post.address)} 
						highlight={this.highlight}
						markUsersPosts={this.markUsersPosts}
						linkForm={this.linkForm}
						postCount={users[post.uid]}
						thread={this.thread}
						hidePost={this.hidePost}

					/>
					{post.children && 
					<div className="replies" >
						{this.threadPosts(post.children, users)}
					</div>}
				</div>
		)
		});
	}
	countUsersPosts(posts, users) {
		for (let i = 0; i < posts.length; i++) {
			if (!users[posts[i].uid]){
				users[posts[i].uid] = 1;
			}
			else {
				users[posts[i].uid] += 1;
			}
			if (posts[i].children) {
				this.countUsersPosts(posts[i].children, users);
			}
		}
		return users;
	}
	linkReply(reply, parent){
		let {posts} = this.state;
		findPost(posts);
		this.setState({posts});
		function findPost(arr) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].address == parent) {
					if (!arr[i].replies) {
						arr[i].replies = [];
					}
					if (!arr[i].replies.includes(reply)) {
						arr[i].replies.push(reply);	
					}
					return true;
				}
				else if (arr[i].children) {
					if (findPost(arr[i].children)) {
						return true;
					}
				}
			}
			return false;
		}
	}
	highlight(address, isHovering, e) {
		let posts = this.state.posts
		findPost(posts);
		this.setState({posts});
		function findPost(arr) {
			for (let i = 0; i < arr.length; i++){
				if (arr[i].address == address){
					arr[i].isHovering = isHovering;
					arr[i].x = e.pageX;
					arr[i].y = e.pageY;
					return true;
				}
				else if (arr[i].children) {
					if (findPost(arr[i].children)) {
						return true;
					}
				}
			}
			return false;
		}
	}
	toggleGallery(){
		//not the react way to find top element, should refactor
		let topImage = this.state.images.reduce((prev, cur) => {
			if (prev.hide) return cur;
			if (cur.hide) return prev;
			let prevTop = document.getElementById(prev.address).getBoundingClientRect().top;
			let curTop = document.getElementById(cur.address).getBoundingClientRect().top;
			if (prevTop > 0 && prevTop < curTop) return prev;
			else return cur;
		});
		if (!topImage || !topImage.hide){
			this.changeImage(topImage.address)
			this.setState({showGallery: !this.state.showGallery})
		}
	}
	changeImage(address){
		let posts = this.state.posts.map(post => {
			post.current = post.address == address;
			return post;
		});
		this.setState({current: address, posts});
	}
	thread(parent, child) {
		let {posts} = this.state;
		let post = findChild(posts, child);
		if (post) {
			if (insertChild(posts, parent, post)) {
				this.setState({posts});
			}
		}
		function findChild(arr, child){
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].address == child) {
					return arr.splice(i,1)[0];
				}
				if (arr[i].children) {
					let child = findChild(arr[i].children)
					if (child) {
						return child;
					}
				}
			}
			return false
		}
		function insertChild(arr, parent, post){
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].address == parent) {
					if (!arr[i].children) {
						arr[i].children = [];
					}
					arr[i].children.push(post);
					return true;
				}
				if (arr[i].children) {
					if (insertChild(arr[i].children, parent, post)) {
						return true;
					}
				}
			}
			return false
		}
	}
	markUsersPosts(uid) {
		let {posts} = this.state;
		mark(posts);
		this.setState({posts});
		function mark(arr){
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].uid == uid) {
					arr[i].marked = !arr[i].marked
				}
				else {
					arr[i].marked = false;
				}
				if (arr[i].children) {
					mark(arr[i].children);
				}
			}

		}
	}
	hidePost(address, shouldHide) {
		let {posts, images} = this.state;
		helper(posts, images);
		this.setState({posts, images});
		function helper(posts, images) {
			for (let i = 0; i < posts.length; i++) {
				if (posts[i].address == address) {
					posts[i].collapse = shouldHide;
					if (posts[i].images){
						for (let j = 0; j < images.length; j++) {
							if (images[j].address == address) {
								images[j].hide = shouldHide;
							}
						}
					}
					if (posts[i].children) {
						hide(posts[i].children, images, shouldHide)
					}
					return;
				}
				else if (posts[i].children) {
					helper(posts[i].children);
				}
			}
		}
		function hide(posts, images, shouldHide) {
			for (let i = 0; i < posts.length; i++) {
				posts[i].hide = shouldHide;
				if (posts[i].images){
					for (let j = 0; j < images.length; j++) {
						if (images[j].address == posts[i].address) {
							images[j].hide = shouldHide;
						}
					}
				}
				if (posts[i].children) {
					hide(posts.children, shouldHide);
				}
			}
		}
	}
	linkForm(address) {
		this.setState({formLink: address})
	}
}

export default Thread;