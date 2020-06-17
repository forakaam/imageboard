import React, {Component} from 'react';

class Address extends Component {
	render() {
		const {to} = this.props;
		return (
			<a href={`#${to}`}>>>{to}</a>
		)
	}

}

export default Address;