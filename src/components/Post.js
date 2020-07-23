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
			liked: this.props.wasLiked || false
		};
		this.like = this.like.bind(this);
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
		this.setState({text});
		if (this.state.parents.length === 1) {
			this.props.thread(this.state.parents[0], this.props.address);
		}

	}
	render() {
		const {images, archived, thread_id, name, collapse, created_at, address, postCount, filesize, dimensions, replies, likes, highlight, hidePost, hide, isHovering, x, y, uid, current, tripcode, markUsersPosts, marked, linkForm, thread} = this.props;
		const {text, parents, liked} = this.state;
		let curLikes = likes;
		if (current) {
			this.node.current.scrollIntoView();
		}
		if (liked && !this.props.wasLiked) {
			curLikes++;
		}
		if (!liked && this.props.wasLiked) {
			curLikes--;
		}
		let backgroundColor = this.colorId(uid);
		let post = 	<div ref={this.node} className={marked ? 'marked' : 'post'}>		
			<div className="header">
				{!collapse && <span onClick={hidePost.bind(this, address, true)}>[-]</span> }
				{collapse && <span onClick={hidePost.bind(this, address, false)}>[+]</span> }{' '}
				{name || 'Anonymous'}{' '} 
				{tripcode && <span className="tripcode"> !{tripcode} </span>} 
				{created_at}{' '}
				(ID: <span 
						className="uid" 
						style={{backgroundColor}} 
						title={`${postCount} post${postCount > 1 ? 's' : ''} by this ID`} 
						onClick={markUsersPosts.bind(this, uid)}>{uid}</span>){' '}
				{curLikes && <span>{curLikes} like{curLikes > 1 ? 's' : ''}</span>}{' '}
				<span onClick={this.like} className={liked ? 'liked' : ''}>[⬆️]</span>
				<a 
					id ={address} 
					className="address" 
					title="Reply to this post" 
					onClick={linkForm.bind(this, address)}> No.{address} </a>
				{replies && replies.map(reply => {
					return <Address key={`${reply}${this.props.address}`}to={reply} highlight={highlight}/>
				 })}
			</div>
			{!collapse && <div>
				{images && 
					<div className="thumbnail-box">
						{images.map((image,i) => {
						return <Image
							key={address + 'image' + i} 
							filename ={image.filename} 
							address={address} 
							filesize={image.filesize} 
							width={image.width} 
							height={image.height} 
							thread_id={thread_id}/>
						})}
					</div>
				}
				<div className="text">{text}</div>
			</div>}
		</div>
		return (
			<div>
				{!hide && <div className={isHovering ? 'highlight' : ''} > {post} </div>}
				{isHovering && <div className="reply" style={{top: y, left: x}}>{post}</div>}
			</div>
		)
	}
	like(){
		let api = `/api/threads/:${this.props.thread_id}/posts/${this.props.id}/like`;
		if (!this.state.liked) {
			fetch(api, {method: 'POST'})
			.then(data => {
				this.setState({liked: true});
			}).catch(err => console.log(err));
		}
		else {
			fetch(api, {method: 'DELETE'})
			.then(data => {
				this.setState({liked: false});
			})
		}
	}
	colorId(uid){
		let colors = ['#ff1d58','#f75990', '#fff685', '#00DDFF', '#0049B7', '#8bf0ba', '#0e0fed', '#94f0f1', '#f2b1d8',];
		let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
		let i = chars.indexOf(uid[2]) % colors.length;
		return colors[i];
	}			
}

export default Post;