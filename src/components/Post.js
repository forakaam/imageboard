import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import Image from './Image';
import Address from './Address';
import '../styles/post.css';

class Post extends Component {
	constructor(props){
		super(props);
		this.state = {
			text: this.props.content
		};
		this.node = React.createRef()
	}
	componentDidMount() {
		let address = />>(\d{5,9})/g;
		let quote = />(.*)/g;
		let link = /(https?:\/\/\S+)/g;
		let text = this.state.text;
		text = reactStringReplace(text, address, (match, i) => {
			this.props.linkReply(match);
			return	<Address to={match} parent={this.props.address} highlight={this.props.highlight} key={match + i}/> 
		});
		text = reactStringReplace(text, quote, (match, i) => {
			return <span className="greentext" key={match + i}>>{match}</span> 
		});
		text = reactStringReplace(text, /\n(.*)/, (match, i) => {
			return <p key={match + i}>{match}</p> 
		});
		text = reactStringReplace(text, link, (match, i) => {
			return <a href={match + i}>{match}</a>
		});
		this.setState({text});

	}
	render() {
		const {image, archived, thread_id, name, content, created_at, address, filesize, dimensions, replies, highlight, isHovering, x, y} = this.props;
		const {text} = this.state;
		let post = 	<div ref={this.node}>		
			<div className="header">
				{name || 'Anonymous'} {created_at} <a id ={address}>No.{address}</a> 
				{replies && replies.map(reply => {
					return <Address key={`${reply}${this.props.address}`}to={reply} highlight={highlight} />
				})}
			</div>
			{image && <Image filename ={image} address={address} filesize={filesize} dimensions={dimensions} thread_id={thread_id}/>}
			<div>{text}</div>
		</div>
		return (
			<div>
				{<div className={isHovering ? 'highlight' : ''} > {post} </div>}
				{isHovering && <div className="reply" style={{top: y, left: x}}>{post}</div>}
			</div>
		)
	}			
	linkAddresses() {
		let re = /^>>(\d{5,9})/g;
		let text = reactStringReplace(this.state.text, re, (match, i) => {
			this.props.linkReply(match);
			return	<Address to={match} parent={this.props.address} key={match + i} highlight={this.props.highlight}/> 
		})
		this.setState({text});
	}
	markGreentext() {
		let re = /^>(.*)/g;
		let text = reactStringReplace(this.state.text, re, (match, i) => {
			return <span className="greentext" key={match + i}>>{match}</span> 
		}); 
		this.setState({text})
	}
	// inViewport(){
	// 	let n = this.node.current;
	// 	if (n) {
	// 		let bounding = n.getBoundingClientRect();
	// 		if (bounding.top >= 0 && bounding.left >= 0 && 
	// 			bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
	// 			bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
	// 				return true
	// 			}
	// 	}
	// 	return false;
	// }

}

export default Post;