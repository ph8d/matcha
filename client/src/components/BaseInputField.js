import React from 'react';
import PropTypes from 'prop-types';


class BaseInputField extends React.Component {
	constructor(props) {
		super(props);

		this.renderInputField = this.renderInputField.bind(this);
		this.renderTextArea = this.renderTextArea.bind(this);
	}

	renderLabel(isInvalid) {
		if (isInvalid) {
			return (
				<label className="label is-small has-text-danger" htmlFor={this.props.name}>
					{this.props.labelText}
				</label>
			);
		} else {
			return (
				<label className="label is-small has-text-grey" htmlFor={this.props.name}>
					{this.props.labelText}
				</label>
			);
		}
	}

	renderTextArea(classes) {
		return (
			<textarea
				value={this.props.value}
				id={this.props.name}
				className={`textarea ${classes}`}
				name={this.props.name}
				placeholder={this.props.placeholder}
				onChange={this.props.onChange}
			/>
		);
	}
	
	renderInputField(classes) {
		return (
			<input
				value={this.props.value}
				id={this.props.name}
				className={`input ${classes}`}
				type={this.props.type}
				name={this.props.name}
				placeholder={this.props.placeholder}
				onChange={this.props.onChange}
				size={this.props.size}
				required
			/>
		);
	}

	render() {
		let validity = this.props.error ? 'is-danger' : '';
		let classes = `${validity} is-radiusless is-shadowless`

		return (
			<div className="field">
				{
					this.props.labelText ?
					this.renderLabel(!!this.props.error) :
					''
				}
				{
					this.props.type === 'textarea' ?
					this.renderTextArea(classes) :
					this.renderInputField(classes)
				}
				{
					this.props.help ?
					<div className="help">{this.props.help}</div> :
					<div className="help is-danger">{this.props.error}</div>
				}
			</div>
		);
	}
}

BaseInputField.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	labelText: PropTypes.string,
	value: PropTypes.string.isRequired,
	error: PropTypes.string,
	help: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	max: PropTypes.number,
	min: PropTypes.number
}

export default BaseInputField;
