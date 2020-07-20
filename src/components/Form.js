import React, {Component} from 'react';
import {withRouter} from "react-router";
import '../styles/form.css';

class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.open,
			thread: this.props.thread_id,
			name: '',
			content: '',
			subject: '',
			files: [],
			links: []
		}
		this.node = React.createRef();
		this.handleClick = this.handleClick.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.resetState = this.resetState.bind(this);
    	this.handleUpload = this.handleUpload.bind(this);

	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		const {thread, name, content, subject, files} = this.state;
		e.preventDefault();
		let form = new FormData()
		for (let i = 0; i < files.length; i++){
			form.append('images', files[i]);
		}
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
	handleUpload() {
		this.setState({files: this.node.current.files});
	}
	resetState(){
		this.props.linkForm('');
		this.setState({
			open: false,
			content: '',
			thread: this.props.thread_id,
			subject: '',
			name: '',
			files: [],
			links: []

		});
	}
	render() {
		let {thread_id, link} = this.props;
		let {open, files, thread, name, content, subject, links} = this.state;
		if (link && !links.includes(link)) {
			if (content) {
				content += '\n';
			}
			content += `>>${link}`;
			links.push(link);
			this.setState({content, links, open:true});

		}
		let charLimit = 500;
		let fileLimit = 5;
		let tooManyChars = content.length > charLimit;
		let tooManyFiles = files.length > fileLimit;
		if (!open) {
			return <img className="create-post" title="Reply to this thread" src={`./../images/assets/create_icon.png`} onClick={this.handleClick}/>
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
						<span className={tooManyChars ? "invalid subtext" : "subtext"}>Character Limit: {content.length}/{charLimit}</span>
						{tooManyFiles && <span className="invalid subtext">{' '}File Limit: {fileLimit}</span>}
					</div>
					<div>
						<input type="file" title={`Limit: ${fileLimit}`} name="image" accept=".jpg, .jpeg, .png, .gif" ref={this.node} multiple="true" onChange={this.handleUpload}/>
						<input type="submit" name="submit" disabled={tooManyFiles || tooManyChars}/>
					</div>
				</form>
			</div>
		)
	}
}

export default withRouter(Form);