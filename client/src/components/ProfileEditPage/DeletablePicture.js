import React from 'react';

class DeletablePicture extends React.Component {
	constructor(props) {
		super(props);
		this.state = { index: props.index }
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		this.props.onDeleteClick(this.state.index);
	}

	render() {
		const { src } = this.props;

		return (
			<div className="box is-inline-flex is-shadowless">
				<figure className="image is-128x128">
					<img src={src} alt=""/>
					<button onClick={this.handleClick} className="delete is-large delete-icon"></button>
				</figure>
			</div>
		);
	}
}

export default DeletablePicture;
