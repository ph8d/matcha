import React from 'react';
import { Link } from 'react-router-dom';
import Tag from './Tag';

class ProfileCard extends React.Component {
	getAgeFromBirthDate(dateString) {
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
		const { profile, pictures, tags } = this.props.user;
		const age = this.getAgeFromBirthDate(profile.birthdate);
		return (
			<div className="card">
				<header className="card-header">
					<p className="card-header-title is-centered">
						{profile.login}
					</p>
				</header>
				<div className="card-image">
					<figure className="image is-square">
						<img
							src={profile.picture}
							alt="Avatar"
						/>
					</figure>
				</div>
				<div className="card-content">
					<Link to="/edit-profile" className="button is-radiusless is-pulled-right">
						Edit profile
					</Link>
					<p>
						<label className="has-text-weight-bold is-capitalized is-size-4">
							{`${profile.first_name} ${profile.last_name} `}
						</label>
						<br/>
						<label className="has-text-grey">
							{age} years old
							<br/>
							{`${profile.gender}, looking for a ${profile.searching_for}`}
							<br/>
							0 kilometers away
						</label>
					</p>
					<hr/>
					<p style={{'whiteSpace': 'pre-line'}}>{profile.bio}</p>
					<hr />
						<div className="field is-grouped is-grouped-multiline">
						{
							tags.map((tag, index) =>
								<div className="control" key={index}>
									<Tag
										className="is-dark has-text-weight-bold"
										value={tag.value}
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

export default ProfileCard;