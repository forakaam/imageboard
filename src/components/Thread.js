import React, {Component} from 'react';
import Post from './Post'
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
		else {
			return (
				<div>
					{posts[0] && <h2>{posts[0]['title']}</h2>}
					{posts[0] && posts[0].archived && <span>archived icon</span>}
					{posts.map(post => <Post key={post.id} {...post} linkReply={this.linkReply.bind(this, post.address)}/>)}
				</div>
			)
		}
	}
	linkReply(reply, op){
		let {posts} = this.state;
		for (let i = 0; i < posts.length; i++) {
			if (posts[i].address == op) {
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
}

export default Thread;