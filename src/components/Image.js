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
		const {filename, filesize, address, dimensions, thread_id} = this.props;
		const {open} = this.state;
		let img;
		if (open) {
			img = <img 
				src={`./../images/${thread_id}/(${address})${filename}`} 
				onClick={this.expandImage.bind(this)} 
				className="image" />
		}
		else  {
			img = <img 
			src={`./../images/${thread_id}/thumb(${address})${filename}.jpg`} 
			onClick={this.expandImage.bind(this)} 
			className="thumbnail" />
		}
		return (
			<div>
				<div>{filename} 
				{' '}
				<a href={`./../images/${thread_id}/(${address})${filename}`} download={filename}>
					<img src={`./../images/assets/download_icon.png`} className="download-icon"/>
				</a>
				{' '}
				({filesize}, {dimensions.width}x{dimensions.height})
				{' '} 
				<a href={`https://www.google.com/searchbyimage?&image_url=${process.env.BASE_URL}/${thread_id}/${filename}&safe=off`}>google</a>
				</div>
				{img}
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


