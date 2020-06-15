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
					<h2>{posts[0]['title']}</h2>
					{posts.map(post => <Post key={post.id} {...post}/>)}
				}
				</div>
			)
		}
	}
}

export default Thread;