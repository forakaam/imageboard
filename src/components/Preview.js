import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/preview.css';

class Preview extends Component {
	render() {
		const {thread_id, image, images, subject, address, content, replies, created_at} = this.props;
		return (
			<div className="preview">
				<Link to={`/threads/${thread_id}`}>
					<img src={`../../images/${thread_id}/(${address})${image}`} className="thumbnail-display"/>
				</Link>
				<div>Replies: {replies}/ Images: {images}/ Created: {new Date(created_at).toLocaleString()}</div>
				<h2 className="subject">{subject}</h2>
				<div className="content">{content}</div>
			</div>
		)
	}
}

export default Preview;