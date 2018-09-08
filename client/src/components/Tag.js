import React from 'react'

class Tag extends React.Component {
	render() {
		return (
			<span className={`tag ${this.props.className}`}>
				<span>{this.props.value}</span>
				{
					this.props.handleClick ?
					<button onClick={this.props.handleClick} type="button" className="delete is-small"></button> :
					''
				}
			</span>
		);
	}
}

export default Tag;