import React, {Component} from 'react';
import {withRouter} from "react-router";
import '../styles/form.css';

class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			thread: this.props.thread_id,
			name: '',
			content: this.props.content || '',
			subject: '',
		}
		this.node = React.createRef();
		this.handleClick = this.handleClick.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.resetState = this.resetState.bind(this);

	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		const {thread, name, content, subject} = this.state;
		e.preventDefault();
		let form = new FormData()
		form.append('image', this.node.current.files[0]);
		form.append('content', content);
		form.append('subject', subject);
		form.append('name', name);
		let opts = {
			method: 'POST',
			body: form
		};
		if (!this.props.thread_id || thread == "new") {
			fetch(`/api/threads/new`, opts)
			.then(res => {
				if (res.status >= 400) throw new Error();
				res.json().then(data => {
					this.props.history.push(`/threads/${data}`);
				})
			})
			.catch(err => alert('Error: Submission failed'))
		}
		else {
			fetch(`/api/threads/${thread}/new`, opts).
			then(res => {
				if (res.status >= 400) throw new Error();
			})
			.catch(err => alert('Error: Submission failed'))
		}
		this.resetState();
	}
	handleClick(e) {
		this.setState({open:true});
	}
	resetState(){
		this.setState({
			open: false,
			content: '',
			thread: this.props.thread_id,
			subject: '',
			name: ''
		});
	}
	render() {
		let {thread_id} = this.props;
		let {open, thread, name, content, subject} = this.state;
		let overLimit = false;
		let charLimit = 500;
		if (content.length > charLimit) overLimit = true;
		if (!open) {
			return <img className="create-post" src={`./../images/assets/create_icon.png`} onClick={this.handleClick}/>
		}
		return (
			<div className="new-post-form">
				<img src={`./../images/assets/exit_icon.png`} className="exit-icon-form" onClick={this.resetState}/>
				<form onSubmit={this.handleSubmit}>
					<div>
						<input type="text" placeholder="Name(optional)" name="name" value={name} onChange={this.handleChange}/>
						<select name="thread" value={thread} onChange={this.handleChange}>
							<option value="new">New Thread</option>
							{thread_id  && <option value={thread_id}>Thread {thread_id}</option> }
						</select> 
						{(!thread_id || thread == "new") && <input type="text" placeholder="Subject" name="subject" value={subject} onChange={this.handleChange}/>}
					</div>
					<div>
						<textarea placeholder="Comment" name="content" value={content} onChange={this.handleChange}/>
						<span className={overLimit ? 'invalid subtext' : 'subtext'}>Character Limit: {content.length}/{charLimit}</span>
					</div>
					<div>
						<input type="file" name="image" accept=".jpg, .jpeg, .png, .gif" ref={this.node}/>
						<input type="submit" name="submit" />
					</div>
				</form>
			</div>
		)
	}
}

export default withRouter(Form);