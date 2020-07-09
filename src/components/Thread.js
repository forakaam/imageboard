import React, {Component} from 'react';
import Header from './Header';
import Post from './Post';
import Form from './Form';
import Gallery from './Gallery';

class Thread extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			posts: [],
			error: null,
			current: '',
			showGallery: false

		}
	this.toggleGallery = this.toggleGallery.bind(this);
	this.changeImage = this.changeImage.bind(this);
	}

	componentDidMount() {
		const {id} = this.props.match.params; 
		fetch(`/api/threads/${id}`)
		.then(res => res.json())
		.then(data => {
			this.setState({
				posts: data, 
				isLoaded: true, 
				images: data.reduce((images, post) => {
					if (post && post.image) {
						images.push({
							filename: post.image, 
							address: post.address,
							dimensions: post.dimensions,
							filesize: post.filesize
						});
					}
					return images;
				},[])})
		}).catch(error => this.setState({error}));
	}
	render() {
		const {isLoaded, error, posts, showGallery, current, images} = this.state
		let head = posts[0];
		if (error) {
			return <div>Error: {error}</div>
		}
		else if (!isLoaded) {
			return <div>Loading ... </div>
		}
		else if (head) {
			return (
				<div>
					<Header toggleGallery={this.toggleGallery}/>
					<h2>{head.subject}</h2>
					{head.archived && <span>archived icon</span>}
					{posts.map(post => {
						return <Post 
							key={post.id} 
							{...post} 
							linkReply={this.linkReply.bind(this, post.address)} 
							highlight={this.highlight.bind(this)}
						/>
					})}
					<Form thread_id={head.thread_id} />
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
	linkReply(reply, parent){
		let {posts} = this.state;
		for (let i = 0; i < posts.length; i++) {
			if (posts[i].address == parent) {
				if (posts[i].replies) {
					posts[i].replies.push(reply);
				}
				else {
					posts[i].replies = [reply];
				}
				this.setState({posts});
				return;
			}
		}
	}
	highlight(address, isHovering, e) {
		let {posts} = this.state;
		for (let i = 0; i < posts.length; i++){
			if (posts[i].address == address){
				posts[i].isHovering = isHovering;
				posts[i].x = e.pageX;
				posts[i].y = e.pageY;
				this.setState({posts});
				return;
			}
		}
	}
	toggleGallery(){
		//not the react way to find top element, should refactor
		let topImage = this.state.images.reduce((prev, cur) => {
			let prevTop = document.getElementById(prev.address).getBoundingClientRect().top;
			let curTop = document.getElementById(cur.address).getBoundingClientRect().top;
			if (prevTop > 0 && prevTop < curTop) return prev;
			else return cur;
		});
		this.setState({showGallery: !this.state.showGallery, current: topImage.address})
	}
	changeImage(address){
		let posts = this.state.posts.map(post => {
			post.current = post.address == address;
			return post;
		});
		this.setState({current: address, posts});
	}
}

export default Thread;