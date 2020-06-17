import React, {Component} from 'react';
import '../styles/image.css';
class Image extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
	}
	render() {
		const {filename, filesize, dimensions, thread_id} = this.props;
		const {open} = this.state;
		return (
			<div>
				<div>{filename}({filesize}, {dimensions.width}x{dimensions.height}, 
				<a href={`https://www.google.com/searchbyimage?&image_url=${process.env.BASE_URL}/${thread_id}/${filename}&safe=off`}>google</a>
				</div>
				<img 
					src={`./../images/${thread_id}/${filename}`} 
					onClick={this.expandImage.bind(this)} 
					className={open ? "image" : "thumbnail"} />
			</div>
		)
	}
	expandImage(){
		if (this.state.open) {
			this.setState({open: false});
		}
		else {
			this.setState({open: true});
		}
	}
}		



export default Image;


