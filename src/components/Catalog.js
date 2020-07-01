import React, {Component} from 'react';
import Preview from './Preview';
import Form from './Form';

class Catalog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			threads: [],
			error: null
		} 
	}
	componentDidMount() {
		fetch('/api/threads')
		.then(res => res.json())
		.then(data => {
			this.setState({
				threads: data,
				isLoaded: true
			})
		}).catch(error => this.setState({error}));
	}
	render(){
		const {isLoaded, threads, error} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>
		} else if (!isLoaded) {
			return <div>Loading ... </div>
		}
		else {
			return (
				<div>
					{threads.map(thread => <Preview key={thread.thread_id} {...thread}/>)}
					<Form/>
				</div>
			);
		}
	} 
}

export default Catalog;