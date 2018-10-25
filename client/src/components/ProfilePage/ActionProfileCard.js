import React from 'react';
import Tag from '../Tag';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import moment from 'moment';
import { observer, inject } from 'mobx-react';

@inject('ProfileStore') @observer
class ActionProfileCard extends React.Component {
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

	renderStatus(online, last_seen) {
		let result = '';

		if (online === 1) {
			result = 'Online';
		} else {
			const currentDate = moment();
			const lastSeen = moment(last_seen);

			if (currentDate.diff(lastSeen, 'days') > 0) {
				result = `last seen ${lastSeen.format('D MMM HH:mm')}`;
			} else {
				result = `last seen ${lastSeen.format('HH:mm')}`;
			}
		}
		return (
			<small className="has-text-grey">
				{result}
			</small>
		);
	}

	renderCardHeader(profile) {
		return (
			<header className="card-header">
				<p className="card-header-title is-centered">
					{profile.login}
					&nbsp;
					{ this.renderStatus(profile.online, profile.last_seen) }
				</p>
			</header>
		);
	}

	renderCardImageSection(pictures) {
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

	renderMainActionButton(status) {
		return (
			<button onClick={this.props.handleMainAction} className="button is-danger is-radiusless is-fullwidth is-size-4">
				<span className="icon">
					<i className="fas fa-heart"></i>
				</span>
				<span className="has-text-weight-bold">
				{
					status.isLiked ?
					"Unlike" :
					"Like"
				}
				</span>
			</button>
		);
	}

	renderDropDown(status) {
		return (
			<div className="dropdown is-hoverable is-right is-pulled-right">
				<div className="dropdown-trigger">
					<button className="button is-light" aria-haspopup="true" aria-controls="dropdown-menu6">
						<span className="icon">
							<i className="fas fa-caret-down"></i>
						</span>
					</button>
				</div>
				<div className="dropdown-menu" id="dropdown-menu6" role="menu">
					<div className="dropdown-content">
						<a onClick={this.props.handleBlock} className="dropdown-item">
							{
								status.isBlocked ?
								"Unblock" :
								"Block"
							}
						</a>
						<a onClick={this.props.handleReport} className="dropdown-item">
							Report
						</a>
					</div>
				</div>
			</div>
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
		const { status, profile, pictures, tags } = this.props.user;
		const { visibleStatus } = this.props.ProfileStore;
		const age = this.getAgeFromBirthDate(profile.birthdate);

		return (
			<div className="card">
				{ this.renderCardHeader(profile) }
				{ this.renderCardImageSection(pictures) }
				{ this.renderMainActionButton(status) }
				<div className="card-content">
					{ this.renderDropDown(status) }
					<p>
						<label className="has-text-weight-bold is-capitalized is-size-4">
							{`${profile.first_name} ${profile.last_name} `}
						</label>
						<label className="has-text-grey is-size-5">{visibleStatus}</label>
						<br/>
						<label className="has-text-grey">
							{age} years old
							<br/>
							{`${profile.gender}, looking for a ${profile.searching_for}`}
							<br/>
							{profile.distance} km away
						</label>
					</p>
					{ this.renderBio() }
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
						Fame {profile.fame}
					</p>
				</footer>
			</div>
		);
	}
}

export default ActionProfileCard;