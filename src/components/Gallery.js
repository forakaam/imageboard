import React, {Component} from 'react';
import '../styles/gallery.css';

class Gallery extends Component {
	constructor(props){
		super(props);
		this.node = React.createRef()
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentDidMount() {
	 	this.node.current.addEventListener('keydown', this.handleKeyPress);
	 	this.node.current.focus();
	}
	componentWillUnmount() {
    	this.node.current.removeEventListener('keydown', this.handleKeyPress);
  	}

	render() {
		const {current, images, thread_id, changeImage, toggleGallery} = this.props; 
		let thumbnails = images.map(image => {
			if (!image.hide) {
				return (
					<img 
						src={`./../images/${thread_id}/thumb(${image.address})${image.filename}.jpg`}			
						onClick={changeImage.bind(this, image.address)}
						className={image.address == current ? "current gallery-thumbnail" : "gallery-thumbnail"} />
				)				
			}
		})
		let image = images.find(image => image.address == current);
		return (
			<div className="gallery-viewport" onClick={this.handleClick} ref={this.node} tabIndex={0}>
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

	handleKeyPress(e) {
		e.preventDefault();
		let {changeImage, current, images} = this.props;
		if (e.code == 'ArrowDown'){
			for (let i = 0; i < images.length -1; i++) {
				if (images[i].address == current) {
					changeImage(images[i + 1].address);
					return;
				}
			}
		}
		else if (e.code == 'ArrowUp') {
			for (let i = 1; i < images.length; i++) {
				if (images[i].address == current) {
					changeImage(images[i - 1].address)
					return;
				}
			}
		}
	}

}

export default Gallery