import React, {Component} from 'react';

class Post extends Component {
	render() {
		const {image, archived, thread_id, content, created_at, address, filesize, dimensions} = this.props;
		let showImage;
		if (image) {
			showImage = (
				<div className="file">
					<a>{image}</a> ({filesize}, {dimensions.width}x{dimensions.height} ), search on google, {archived && <span>archived icon</span>}
					<img src={`../../images/${thread_id}/${image}`}/>
				</div>
			);
		}
		return (
			<div>
				{showImage}
				<div className="content">{content}
					<div className="info">Anonymous {created_at} No.{address}</div>
					<div>{content}</div>
				</div>
			</div>
		)
	}
}

export default Post;