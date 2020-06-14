import React, {Component} from 'react';
import '../styles/preview.css';

class Preview extends Component {
	render() {
		const {thread_id, image, title, content} = this.props;
		return (
			<div>
				<img src={require(`../images/${thread_id}/${image}`)}/>
			</div>
		)
	}
}

export default Preview;