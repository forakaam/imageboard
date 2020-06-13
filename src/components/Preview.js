import React, {Component} from 'react';
import '../styles/preview.css'

class Preview extends Component {
	render() {
		const {id, image, title, content} = this.props;
		return (
			<div>
				<img src={'images' + id + '\\' + image}/>
			</div>
		)
	}
}

export default Preview;