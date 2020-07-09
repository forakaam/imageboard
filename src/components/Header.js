import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
	render() {
		return (
			<header className="header">
				<Link to="/">Home</Link>
				<img src={`./../images/assets/gallery_icon.png`} className="gallery-icon" onClick={this.props.toggleGallery.bind(this)}/>
			</header>
		)
	}

}

export default Header;