import React from 'react';
import Tag from '../Tag';
import { inject, observer } from 'mobx-react';

@inject('RegistrationStore', 'AuthStore', 'UserStore') @observer
class ConfirmationStep extends React.Component {
	getAgeFromDate(dateString) {
		const today = new Date();
		const birthDate = new Date(dateString);
		let age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	render() {
		const { user, picture } = this.props.RegistrationStore;
		const { month, day, year } = user.birthdate;
		const age = this.getAgeFromDate(`${month} ${day}, ${year}`);
		console.log(this.props.RegistrationStore.birthDateSQLString);
		return (
			<div>
				<figure className="image">
					<img src={picture.src || picture.placeholder} alt="Avatar" />
				</figure>
				<div className="content">
					<p>
						<label className="has-text-weight-bold is-capitalized is-size-4">
							{`${user.first_name} ${user.last_name}, `}
						</label>
						<label className="is-size-4">{age}</label>
						<br/>
						<label className="has-text-grey">
							{user.gender}{`, looking for a ${user.searching_for}`}
							<br/>
							0 kilometers away
						</label>
					</p>
					<hr/>
					<p style={{'whiteSpace': 'pre-line'}}>{user.bio}</p>
					<hr />
						<div className="field is-grouped is-grouped-multiline">
						{
							user.tags.map((tag, index) =>
								<div className="control" key={index}>
									<Tag
										className="is-dark has-text-weight-bold"
										value={tag}
									/>
								</div>
							)
						}	
						</div>
				</div>
			</div>
		);
	}
}

export default ConfirmationStep;