import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/preview.css';

class Preview extends Component {
	render() {
		const {id, subject, counts, head} = this.props;
		return (
			<div className="preview">
				<Link to={`/threads/${id}`}>
					{head.images &&
					<img 
						src={`../../images/${id}/thumb(${head.address})${head.images[0].filename}.jpg`} 
						className="thumbnail-display"/>
					}
				</Link>
				<div>Replies: {counts.replies}/ Images: {counts.images}/ Created: {new Date(head.created_at).toLocaleString()}</div>
				<h2 className="subject">{subject}</h2>
				<div className="content">{head.content}</div>
			</div>
		)
	}
}

export default Preview;