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
				threads: data.threads,
				heads: data.heads,
				counts: data.counts,
				isLoaded: true
			})
		}).catch(error => this.setState({error}));
	}
	render(){
		const {isLoaded, threads, heads, counts, error} = this.state;
		if (error) {
			return <div>Error: {error.message}</div>
		} else if (!isLoaded) {
			return <div>Loading ... </div>
		}
		else {
			return (
				<div>
					{threads.map(thread => {
						return <Preview key={thread.id} {...thread} counts={counts[thread.id]} head={heads[thread.id]}/>
					})}
					<Form/>
				</div>
			);
		}
	} 
}

export default Catalog;