import React, {Component} from 'react';

class Address extends Component {
	render() {
		const {to, highlight} = this.props;
		return (
			<a href={`#${to}`} onMouseOver={highlight.bind(this, to, true)} onMouseOut={highlight.bind(this, to, false)}>>>{to}</a>
		)
	}
}

export default Address;