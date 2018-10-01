import React from 'react';

class InteractivePicture extends React.Component {
	constructor(props) {
		super(props);
		this.state = { index: props.index }
		this.handleDelClick = this.handleDelClick.bind(this);
		this.handlePrimaryActionClick = this.handlePrimaryActionClick.bind(this);
	}

	handleDelClick(e) {
		this.props.onDeleteClick(this.state.index);
	}

	handlePrimaryActionClick(e) {
		this.props.onPrimaryAction(this.state.index);
	}

	render() {
		const { src } = this.props;

		if (this.props.showButtons) {
			return (
				<div className="box is-inline-flex is-shadowless img-container">
					<figure className="image is-128x128">
						<img src={src} alt=""/>
						<button onClick={this.handleDelClick} className="delete is-radiusless is-large delete-icon"></button>
						<button onClick={this.handlePrimaryActionClick} className="set-as-profile-pic-btn button is-black is-radiusless is-fullwidth">
							<span className="icon">
								<i className="fas fa-user-circle"></i>
							</span>
						</button>
					</figure>
				</div>
			);
		} else {
			return (
				<div className="box is-inline-flex is-shadowless img-container">
					<figure className="image is-128x128">
						<img src={src} alt=""/>
						{ this.props.renderButtons && this.renderButtons() }
					</figure>
				</div>
			);
		}
	}
}

export default InteractivePicture;
