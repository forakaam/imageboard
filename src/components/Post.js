import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Image from './Image';
import Address from './Address';

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
				let address = /\d{8}/.exec(block)[0];
				this.props.linkReply(address);
				return <Address to={address} parent={this.props.address}/> 
			}
			else {
				return block;
			}
		});
		this.setState({text: result});
	}
	render() {
		const {image, archived, thread_id, content, created_at, address, filesize, dimensions, replies} = this.props;
		const {text} = this.state;
		console.log("replies:", replies)
		return (
			<div>
				<a id ={address}>			
				<div className="header">Anonymous {created_at} No.{address} {replies && replies.map(reply => <Address to={reply}/>)}</div>
				</a>
				{image && <Image filename ={image} filesize={filesize} dimensions={dimensions} thread_id={thread_id}/>}
				<div>{text}</div>
			</div>
		)
	}
}

export default Post;