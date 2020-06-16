import React, {Component} from 'react';

class Post extends Component {
	render() {
		const {image, archived, thread_id, content, created_at, address} = this.props;
		let img;
		if (image) {
			img = (
				<div className="file">
					<div>
					<a>{image}</a> filesize, dimensions, search on google, {archived && <span>archived icon</span>}
					</div>
					<img src={`../../images/${thread_id}/${image}`}/>
					}
				</div>
			);
		}
		return (
			<div>
				{img}
				<div className="content">{content}
					<div className="info">Anonymous {created_at} No.{address}</div>
					<div>{content}</div>
				</div>
			</div>
		)
	}
}

export default Post;