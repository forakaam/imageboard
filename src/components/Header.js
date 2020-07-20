import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
	render() {
		let {counts, toggleGallery} = this.props;
		return (
			<header className="header">
				<Link to="/">Home</Link>
				<span title="Posts/Images/Users" className="counts">{counts.posts}/{counts.images}/{counts.users}</span>
				<img src={`./../images/assets/gallery_icon.png`} className="gallery-icon" onClick={toggleGallery.bind(this)}/>
			</header>
		)
	}

}

export default Header;