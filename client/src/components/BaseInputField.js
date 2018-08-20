import React from 'react';

class BaseInputField extends React.Component {
	render() {
		let validity = this.props.error ? 'is-danger' : '';
		let inputClasses = `${validity} input`

		return (
			<div className={this.props.className}>
				<label className="label is-small has-text-grey" htmlFor={this.props.name}>{this.props.labelText}</label>
				<div className="control"></div>
				<input
					value={this.props.value}
					id={this.props.name}
					className={inputClasses}
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					onChange={this.props.onChange}
					required
				/>
			<div className="help is-danger">{this.props.error}</div>
			</div>
		);
	}
}

export default BaseInputField;
