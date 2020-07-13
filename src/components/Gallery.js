import React, {Component} from 'react';
import '../styles/gallery.css';

class Gallery extends Component {
	render() {
		const {current, images, thread_id, changeImage, toggleGallery} = this.props; 
		let thumbnails = images.map(image => {
			return (
				<img 
					src={`./../images/${thread_id}/thumb(${image.address})${image.filename}.jpg`}			
					onClick={changeImage.bind(this, image.address)}
					className={image.address == current ? "current gallery-thumbnail" : "gallery-thumbnail"} />
			)
		})
		let image = images.find(image => image.address == current);
		return (
			<div className="gallery-viewport" onClick={this.handleClick.bind(this)}>
				<div className="image-box">
					<img className="current-image" src={`./../images/${thread_id}/(${image.address})${image.filename}`}/>
				</div>
				<img src={`./../images/assets/exit_icon.png`} className="exit-icon" onClick={toggleGallery.bind(this)}/>
				<div className="sidebar">
				{thumbnails}
				</div>
			</div>
		)
	}
	handleClick(e) {
		if (e.target.className == 'image-box')
			this.props.toggleGallery();
	}

}

export default Gallery