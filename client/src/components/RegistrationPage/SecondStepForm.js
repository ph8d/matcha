import React from 'react'
import { observer, inject } from 'mobx-react';

@inject('RegistrationStore') @observer
class SecondStepForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.props.RegistrationStore.setFieldValue(e.target.name, e.target.value);
	}
	
	render() {
		const { user } = this.props.RegistrationStore;

		return (
			<form>
				<div className="field">
					<label className="label is-small has-text-grey">Gender</label>
					<div className="select is-fullwidth">
						<select
							onChange={this.handleChange}
							name="gender"
							className="is-radiusless"
							defaultValue={user.gender}
							required
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
				</div>
				<div className="field">
					<label className="label is-small has-text-grey">Searching for...</label>
					<div className="select is-fullwidth">
						<select
							onChange={this.handleChange}
							name="searching_for"
							className="is-radiusless"
							defaultValue={user.searching_for}
							required
						>
							<option value="*">Male & Female</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
				</div>
			</form>
		);
	}
}

export default SecondStepForm;