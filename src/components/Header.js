import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sort: 'byID' 
		};
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		const {changeSort, counts, toggleGallery} = this.props;
		const {sort} = this.state;
		return (
			<header className="header">
				<Link to="/">Home</Link>
				<span title="Posts/Images/Users" className="counts">{counts.posts}/{counts.images}/{counts.users}</span>
				<img src={`./../images/assets/gallery_icon.png`} className="gallery-icon" onClick={toggleGallery.bind(this)}/>
				<form>
					<label>
						Select sorting mechanism:
						<select value={sort} onChange={this.handleChange}>
							<option value="byID">Chronological</option>
							<option value="byLikes">By Number of Likes</option>
						</select>
					</label>
				</form>
			</header>
		)
	}
	handleChange(e) {
		this.setState({sort: e.target.value});
		this.props.changeSort(e.target.value);
	}

}

export default Header;