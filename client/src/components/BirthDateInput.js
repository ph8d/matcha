import React from 'react';

class BirthDateInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
		}
	}

	render() {
		const { labelText, month, day, year, error } = this.props;
		return(
			<div>
				<p className="label is-small has-text-grey">{labelText}</p>
				<div className="field has-addons">
					<div className="control">
						<div className="select">
							<select
								name="month"
								onChange={this.props.onChange}
								className="is-radiusless"
								defaultValue={month}
								required
							>
								<option value="" disabled>Month</option>
								{
									this.state.monthsLong.map((month, index) => (
										<option key={index} value={month}>{month}</option>
									))
								}
							</select>
						</div>
					</div>
					<div className="control">
						<input
							className="input is-radiusless is-shadowless"
							type="text"
							name="day"
							placeholder="Day"
							value={day}
							onChange={this.props.onChange}
						/>
					</div>
					<div className="control is-expanded">
						<input
							className="input is-radiusless is-shadowless"
							type="text"
							name="year"
							placeholder="Year"
							value={year}
							onChange={this.props.onChange}
						/>
					</div>
				</div>
				<div className="help is-danger">{error}</div>
			</div>
		);
	}
}

export default BirthDateInput;