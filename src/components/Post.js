import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Post extends Component {
	constructor(props){
		super(props);
		this.state = {
			text: []
		}
	}
	componentDidMount() {
		let re = /(>>\d{8})/g;
		let result = this.props.content.split(re).map(block => {
			if (block.match(re)) {
				return <a href={`#${this.props.address}`}>{block}</a> 
			}
			else {
				return block;
			}
		});
		this.setState({text: result});
	}
	render() {
		const {image, archived, thread_id, content, created_at, address, filesize, dimensions} = this.props;
		const {text} = this.state;
		let showImage;
		if (image) {
			showImage = (
				<div className="file">
					<a id ={address}><a>{image}</a> ({filesize}, {dimensions.width}x{dimensions.height} ), search on google, {archived && <span>archived icon</span>}</a>
					<img src={`../../images/${thread_id}/${image}`}/>
				</div>
			);
		}
		return (
			<div>
				{showImage}
				<div className="content">
					<div className="info">Anonymous {created_at} No.{address}</div>
					<div>{text}</div>
				</div>
			</div>
		)
	}
}

export default Post;