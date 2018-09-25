import React from 'react';
import Tag from '../Tag';
import { observer, inject } from 'mobx-react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import moment from 'moment';


@inject('ProfileStore') @observer
class ActionProfileCard extends React.Component {
	constructor(props) {
		super(props);

		this.handleLike = this.handleLike.bind(this);
		this.handleBlock = this.handleBlock.bind(this);
		this.handleReport = this.handleReport.bind(this);
	}

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

	handleLike(e) {
		const { ProfileStore } = this.props;
		const { user } = ProfileStore;
		if (user.status.isLiked) {
			ProfileStore.unlike();
		} else {
			ProfileStore.like();
		}
	}

	handleBlock(e) {
		const { ProfileStore } = this.props;
		const { user } = ProfileStore;
		if (user.status.isBlocked) {
			ProfileStore.unblock();
		} else {
			ProfileStore.block();
		}
	}

	handleReport() {
		const { ProfileStore } = this.props;
		ProfileStore.report();
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

	render() {
		const { status, profile, pictures, tags } = this.props.user;
		const age = this.getAgeFromBirthDate(profile.birthdate);
		const gallery = [];

		pictures.forEach(pic => {
			gallery.push({ original: pic.src });
		});

		return (
			<div className="card">
				<header className="card-header">
					<p className="card-header-title is-centered">
						<span className="icon has-text-danger">
							<i className="fas fa-fire"></i>
						</span>
						{profile.login}
						&nbsp;
						{ this.renderStatus(profile.online, profile.last_seen) }
					</p>
				</header>
				<div className="card-image">
					<ImageGallery
						items={gallery}
						disableSwipe={true}
						infinite={false}
						showThumbnails={false}
						showFullscreenButton={false}
						showPlayButton={false}
					/>
				</div>
				<button onClick={this.handleLike} className="button is-danger is-radiusless is-fullwidth is-size-4">
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
				<div className="card-content">
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
								<a onClick={this.handleBlock} className="dropdown-item">
									{
										status.isBlocked ?
										"Unblock" :
										"Block"
									}
								</a>
								<a onClick={this.handleReport} className="dropdown-item">
									Report
								</a>
							</div>
						</div>
					</div>
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
									className="is-light has-text-weight-bold"
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

export default ActionProfileCard;