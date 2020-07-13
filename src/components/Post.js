import React, {Component} from 'react';
import reactStringReplace from 'react-string-replace';
import Image from './Image';
import Address from './Address';
import '../styles/post.css';

class Post extends Component {
	constructor(props){
		super(props);
		this.state = {
			text: this.props.content,
			backgroundColor: '',
			parents: [],
		};
		this.node = React.createRef()
	}
	componentDidMount() {
		let address = />>(\d{5,9})/g;
		let quote = />(.*)/g;
		let link = /(https?:\/\/\S+)/g;
		let formattedLink = /(\[.*\]\(https?:\/\/\S+\))/g;
		let paragraph = /\n(.*)/g;
		let text = this.state.text;
		text = reactStringReplace(text, address, (match, i) => {
			this.props.linkReply(match);
			let {parents} = this.state;
			parents.push(match);
			this.setState({parents});
			return	<Address to={match} parent={this.props.address} highlight={this.props.highlight} key={match + i}/> 
		});
		text = reactStringReplace(text, quote, (match, i) => {
			return <span className="greentext" key={match + i}>>{match}</span> 
		});
		text = reactStringReplace(text, formattedLink, (match, i) => {
			let word = match.match(/\[(.*)\]/)[1];
			let link = match.match(/\((\S+)\)/)[1];
			return <a href={link} key={match + i}>{word}</a>
		});
		text = reactStringReplace(text, link, (match, i) => {
			return <a href={match + i} key={match + i}>{match}</a>
		});
		text = reactStringReplace(text, paragraph, (match, i) => {
			return <p key={match + i}>{match}</p> 
		});
		this.setState({text});

	}
	render() {
		const {image, archived, thread_id, name, created_at, address, postCount, filesize, dimensions, replies, highlight, isHovering, x, y, uid, current, tripcode, markUsersPosts, marked, linkForm} = this.props;
		const {text, parents} = this.state;
		if (parents.length === 1) {
			this.props.thread(parents[0], address);
		}
		if (current){
			this.node.current.scrollIntoView();
		}
		let backgroundColor = this.colorId(uid);
		let post = 	<div ref={this.node} className={marked ? 'marked' : 'post'}>		
			<div className="header">
				{name || 'Anonymous'}{' '} 
				{tripcode && <span class="tripcode"> !{tripcode} </span>} 
				{created_at}{' '}
				(ID: <span class="uid" style={{backgroundColor}} title={`${postCount} post${postCount > 1 ? 's' : ''} by this ID`} onClick={markUsersPosts.bind(this, uid)}>{uid}</span>) 
				<a id ={address} className="address" onClick={linkForm.bind(this, address)}> No.{address} </a>
				{replies && replies.map(reply => {
					return <Address key={`${reply}${this.props.address}`}to={reply} highlight={highlight}/>
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
	colorId(uid){
		let colors = ['#ff1d58','#f75990', '#fff685', '#00DDFF', '#0049B7', '#8bf0ba', '#0e0fed', '#94f0f1', '#f2b1d8',];
		let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
		let i = chars.indexOf(uid[2]) % colors.length;
		return colors[i];
	}			
}

export default Post;