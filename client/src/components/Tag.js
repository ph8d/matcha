import React from 'react'

class Tag extends React.Component {
	constructor(props) {
		super(props);
		this.state = { index: props.index };
		this.onDelete = this.onDelete.bind(this);
	}

	onDelete(e) {
		this.props.onDelete(this.state.index);
	}

	render() {
		return (
			<span className={`tag ${this.props.className}`}>
				<span>{this.props.value}</span>
				{
					this.props.onDelete ?
					<button onClick={this.onDelete} type="button" className="delete is-small"></button> :
					''
				}
			</span>
		);
	}
}

export default Tag;