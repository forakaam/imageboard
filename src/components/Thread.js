import React, {Component} from 'react';
import Post from './Post';
import Form from './Form';

class Thread extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			posts: [],
			error: null

		}
	}
	componentDidMount() {
		const {id} = this.props.match.params; 
		fetch(`/api/threads/${id}`)
		.then(res => res.json())
		.then(data => {
			this.setState({posts: data, isLoaded: true})
		}).catch(error => this.setState({error}));
	}
	render() {
		const {isLoaded, error, posts} = this.state
		if (error) {
			return <div>Error: {error}</div>
		}
		else if (!isLoaded) {
			return <div>Loading ... </div>
		}
		else if (posts[0]) {
			return (
				<div>
					<h2>{posts[0]['subject']}</h2>
					{posts[0].archived && <span>archived icon</span>}
					{posts.map(post => {
						return <Post 
							key={post.id} 
							{...post} 
							linkReply={this.linkReply.bind(this, post.address)} 
							highlight={this.highlight.bind(this)}
						/>
					})}
					<Form parent={posts[0]['thread_id']} />
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

		let posts = this.state.posts;
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
}

export default Thread;