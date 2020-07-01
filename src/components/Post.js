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
		}
	}
	componentDidMount() {
		let address = />>(\d{5,9})/g;
		let quote = />(.*)/g;
		let link = /(https?:\/\/\S+)/g;
		let text = this.state.text;
		text = reactStringReplace(text, address, (match, i) => {
			this.props.linkReply(match);
			return	<Address to={match} parent={this.props.address} key={match + i}/> 
		});
		text = reactStringReplace(text, quote, (match, i) => {
			return <span className="greentext" key={match + i}>>{match}</span> 
		});
		text = reactStringReplace(text, /\n(.*)/, (match, i) => {
			return <p key={match + i}>{match}</p> 
		});
		text = reactStringReplace(text, link, (match, i) => {
			return <a href={match}>{match}</a>
		});
		this.setState({text});

	}
	render() {
		const {image, archived, thread_id, name, content, created_at, address, filesize, dimensions, replies} = this.props;
		const {text} = this.state;
		return (
			<div>		
				<div className="header">
					{name || 'Anonymous'} {created_at} <a id ={address}>No.{address}</a> {replies && replies.map(reply => <Address key={`${reply}${this.props.address}`}to={reply}/>)}
				</div>
				{image && <Image filename ={image} address={address} filesize={filesize} dimensions={dimensions} thread_id={thread_id}/>}
				<div>{text}</div>
			</div>
		)
	}			
	linkAddresses() {
		let re = /^>>(\d{5,9})/g;
		let text = reactStringReplace(this.state.text, re, (match, i) => {
			this.props.linkReply(match);
			return	<Address to={match} parent={this.props.address} key={match + i}/> 
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

}

export default Post;