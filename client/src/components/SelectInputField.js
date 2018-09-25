import React from 'react';
import PropTypes from 'prop-types';

class SelectInputField extends React.Component {
	render() {
		const { defaultValue, onChangeHandler, labelText, name} = this.props;

		return(
			<div className="field">
				<label className="label is-small has-text-grey">{labelText}</label>
				<div className="select is-fullwidth">
					<select
						onChange={onChangeHandler}
						name={name}
						className="is-radiusless"
						defaultValue={defaultValue}
						required
					>
						{this.props.children}
					</select>
				</div>
			</div>
		);
	}
}

SelectInputField.propTypes = {
	labelText: PropTypes.string,
	defaultValue: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChangeHandler: PropTypes.func.isRequired,
};

export default SelectInputField;
