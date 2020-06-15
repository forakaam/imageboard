import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/preview.css';

class Preview extends Component {
	render() {
		const {thread_id, image, images, title, content, replies, created_at} = this.props;
		return (
			<div class="preview">
				<Link to={`/threads/${thread_id}`}>
					<img src={require(`../images/${thread_id}/${image}`)}/>
					<div>Replies: {replies}/ Images: {images}/ Created: {new Date(created_at).toLocaleString()}</div>
					<h2 class="title">{title}</h2>
					<div class="content">{content}</div>
				</Link>
			</div>
		)
	}
}

export default Preview;