import React from 'react';

class BaseInputField extends React.Component {
	render() {
		let validity = this.props.error ? 'is-invalid' : '';
		let inputClasses = `${validity} form-control`

		return (
			<div className={this.props.className}>
				<label htmlFor={this.props.name}>{this.props.labelText}</label>
				<input
					id={this.props.name}
					className={inputClasses}
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					required
				/>
				<div className="invalid-feedback">{this.props.error}</div>
			</div>
		);
	}
}

export default BaseInputField;
