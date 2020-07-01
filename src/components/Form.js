import React, {Component} from 'react';
import {withRouter} from "react-router";
import '../styles/form.css';

class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			thread: this.props.parent,
			name: '',
			content: this.props.content || '',
			subject: '',
		}
		this.image = React.createRef();
		this.handleClick = this.handleClick.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);

	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		const {thread, name, content, subject} = this.state;
		e.preventDefault();
		this.setState({open:false});
		let form = new FormData()
		form.append('image', this.image.current.files[0]);
		form.append('content', content);
		form.append('thread', thread);
		form.append('subject', subject);
		form.append('name', name);
		this.setState({
			content: '',
			thread: this.props.parent,
			subject: '',
			name: ''
		});

		let opts = {
			method: 'POST',
			body: form
		};
		if (!this.props.parent || thread == "new") {
			fetch(`/api/threads/new`, opts)
			.then(res => res.json())
			.then(data => {
				if (res.status >= 300) throw new Error();
				this.props.history.push(`/threads/${data}`);
			})
			.catch(err => alert('Error: Submission failed'))
		}
		else {
			fetch(`/api/threads/${thread}/new`, opts).
			then(res => {
				if (res.status >= 300) throw new Error();
			})
			.catch(err => alert('Error: Submission failed'))
		}
	}
	handleClick(e) {
		this.setState({open:true});
	}
	render() {
		let {parent} = this.props;
		let {open, thread, name, content, subject} = this.state;
		let overLimit = false;
		let charLimit = 500;
		if (content.length > charLimit) overLimit = true;
		if (!open) {
			return <img className="create-post" src={`./../images/assets/create_icon.png`} onClick={this.handleClick}/>
		}
		return (
			<div className="new-post-form">
				<form onSubmit={this.handleSubmit}>
					<div>
						<input type="text" placeholder="Name(optional)" name="name" value={name} onChange={this.handleChange}/>
						<select name="thread" value={thread} onChange={this.handleChange}>
							<option value="new">New Thread</option>
							{parent  && <option value={parent}>Thread {parent}</option> }
						</select> 
						{(!this.props.parent || thread == "new") && <input type="text" placeholder="Subject" name="subject" value={subject} onChange={this.handleChange}/>}
					</div>
					<div>
						<textarea placeholder="Comment" name="content" value={content} onChange={this.handleChange}/>
						<span className={overLimit ? 'invalid subtext' : 'subtext'}>Character Limit: {content.length}/{charLimit}</span>
					</div>
					<div>
						<input type="file" name="image" accept=".jpg, .jpeg, .png, .gif" ref={this.image}/>
						<input type="submit" name="submit" />
					</div>
				</form>
			</div>
		)
	}
}

export default withRouter(Form);