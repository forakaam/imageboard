import React, {Component} from 'react';
//const images = require.context('../images', true, /\.(jpe?g|png|gif)$/);
				
class Post extends Component {
	render() {
		const {image, archived, thread_id, content, created_at, address} = this.props;
		let img;
		if (image) {
			img = (
				<div class="file">
					<div>
					<a>{image}</a> filesize, dimensions, search on google, {archived && <span>archived icon</span>}
					</div>
					<img src={`../img/${thread_id}/${image}`}/>
					}
				</div>
			);
		}
		return (
			<div>
				{img}
				<div class="content">{content}
					<div class="info">Anonymous {created_at} No.{address}</div>
					<div>{content}</div>
				</div>
			</div>
		)
	}
}

export default Post;