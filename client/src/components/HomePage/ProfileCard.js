import React from 'react';
import { Link } from 'react-router-dom';
import Tag from '../Tag';
import ImageGallery from 'react-image-gallery';

const maxWidth500 = { 'maxWidth': 'auto' }

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

	renderCardHeader(profile) {
		return (
			<header className="card-header">
				<p className="card-header-title is-centered">
					{profile.login}
				</p>
			</header>
		);
	}

	renderCardImageSection(profile_picture_id, pictures) {
		const gallery = [];
		pictures.forEach(pic => {
			gallery.push({ original: pic.src });
		});

		return (
			<div className="card-image">
				<ImageGallery
					items={gallery}
					disableSwipe={true}
					infinite={false}
					showBullets={true}
					showThumbnails={false}
					showFullscreenButton={false}
					showPlayButton={false}
				/>
			</div>
		);
	}

	renderMainActionButton(profile) {
		return (
			<Link to="/edit-profile">
				<button className="button is-dark is-radiusless is-fullwidth is-size-4">
					<span className="icon">
						<i className="far fa-edit"></i>
					</span>
					<span>
						Edit profile
					</span>
				</button>
			</Link>
		);
	}

	renderBio(bio) {
		if (bio) {
			return (
				<React.Fragment>
					<hr/>
					<p style={{'whiteSpace': 'pre-line'}}>{bio}</p>
				</React.Fragment>
			);
		}
	}

	render() {
		const { profile, pictures, tags } = this.props.user;
		const age = this.getAgeFromBirthDate(profile.birthdate);

		return (
			<div className="card" style={maxWidth500}>
				{ this.renderCardHeader(profile) }
				{ this.renderCardImageSection(profile.picture_id, pictures) }
				{ this.renderMainActionButton(profile) }
				<div className="card-content">
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
						</label>
					</p>
					{ this.renderBio(profile.bio) }
					<hr />
					<div className="field is-grouped is-grouped-multiline">
					{
						tags.map((tag, index) =>
							<div className="control" key={index}>
								<Tag
									className="is-light has-text-weight-bold"
									value={tag.value}
								/>
							</div>
						)
					}	
					</div>
				</div>
				<footer className="card-footer">
					<p className="card-footer-item has-text-centered has-text-grey is-size-7">
						Popularity {profile.fame}
					</p>
				</footer>
			</div>
		);
	}
}

export default ProfileCard;