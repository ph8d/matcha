import React from 'react';
import SpinLoad from '../SpinLoad';
import MyGoogleMap from '../GoogleMaps/MyGoogleMap';
import BaseInputField from '../BaseInputField';
import TagsInputCard from '../TagsInputCard';
import Tag from '../Tag';
import SelectInputField from '../SelectInputField';
import BirthDateInput from '../BirthDateInput';
import DeletablePicture from './DeletablePicture';
import { inject, observer } from 'mobx-react';
import './style.css';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import imgHelpers from '../../helpers/imgHelpers';

@inject('ProfileEditStore') @observer
class ProfileEditCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			selectedImgFile: '',
			selectedImgSrc: ''
		}

		this.onFileChange = this.onFileChange.bind(this);
		this.deletePicture = this.deletePicture.bind(this);
		this.saveImage = this.saveImage.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleTagInput = this.handleTagInput.bind(this);
		this.addTag = this.addTag.bind(this);
		this.handleTagDelete = this.handleTagDelete.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
		this.handleBirthdateInput = this.handleBirthdateInput.bind(this);
		this.updateUserLocation = this.updateUserLocation.bind(this);
		this.fileInput = React.createRef();
	}

	handleInput(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.setFieldValue(e.target.name, e.target.value);
	}

	handleBirthdateInput(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.setBirthDate(e.target.name, e.target.value);
	}

	handleTagInput(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.setTagInput(e.target.value);
	}

	addTag(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.addTag();
	}

	handleTagDelete(index) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.deleteTag(index);
	}

	updateUserLocation(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.locateWithNavigator();
	}

	updateProfile(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.updateProfile();
	}

	onFileChange(e) {
		const file = e.target.files[0];
		e.target.value = '';

		this.setState({ selectedImgFile: file });

		if (file && file.size < 3000000) {
			imgHelpers.imgFileToBase64(file)
				.then(src => {
					this.setState({ selectedImgSrc: src });
					this.showModal();
				})
				.catch(error => {
					console.log(error);
				});
		} else {
			console.error('file is too big')
		}
	}

	showModal(e) {
		this.setState({ showModal: true })
	}

	closeModal(e) {
		this.setState({ showModal: false });
	}

	saveImage(e) {
		const { ProfileEditStore } = this.props;
		const canvas = this.cropper.getCroppedCanvas();

		if (canvas && canvas.width > 0 && canvas.height > 0) {
			const croppData = this.cropper.getData();
			const { selectedImgFile } = this.state;
			ProfileEditStore.uploadPicture(selectedImgFile, croppData);
		} else {
			console.error('Error occured, file is probably invalid.');
		}
		this.closeModal();
	}

	deletePicture(index) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.deletePicture(index);
	}

	renderModal() {
		const { selectedImgSrc } = this.state;

		return (
			<div className="modal is-active">
				<div onClick={this.closeModal} className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Crop your photo</p>
					</header>
					<section className="modal-card-body">
						<Cropper
							ref={el => this.cropper = el}
							src={selectedImgSrc}
							aspectRatio={1/1}
							guides={true}
							highlight={false}
							viewMode={2}
						/>
					</section>
					<footer className="modal-card-foot">
						<button onClick={this.saveImage} type="button" className="button is-success">Save</button>
						<button onClick={this.closeModal} type="button" className="button">Cancel</button>
					</footer>
				</div>
				<button type="button" className="modal-close is-large" aria-label="close"></button>
			</div>
		);
	}

	renderPictures(pictures) {
		if (pictures.length > 0) {
			return pictures.map((picture, index) =>
				<DeletablePicture
					key={index}
					src={picture.src}
					index={index}
					onDeleteClick={this.deletePicture}
				/>
			);
		} else {
			return <div className="box is-shadowless">
				<small className="has-text-grey">You have no pictures...</small>
			</div>
		}
	}

	renderUserPictureManager(pictures, numberOfPictures, errors) {
		const status = numberOfPictures >= 5 ? true : false;

		return (
			<div className="field">
				<label className="label has-text-grey has-text-centered is-size-7">
					Pictures
				</label>
				<div className="has-text-centered">
					{ this.renderPictures(pictures) }
				</div>
				<div className="field help has-text-centered is-danger">
					{errors.pictures}
				</div>
				<input disabled={status} onChange={this.onFileChange} ref={this.fileInput} className="file-input" type="file" accept="image/*" />
				<button disabled={status} onClick={() => {this.fileInput.current.click()}} className="button is-fullwidth ">
					Add picture
				</button>
			</div>
		);
	}

	renderBasicInfoFields(profile, tags, tagInput, errors) {
		return (
			<div>
				<BaseInputField
					value={profile.first_name}
					name="first_name"
					labelText="First Name"
					type="text"
					placeholder="John"
					error={errors.first_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={profile.last_name}
					name="last_name"
					labelText="Last Name"
					type="text"
					placeholder="Doe"
					error={errors.last_name}
					onChange={this.handleInput}
				/>

				<BaseInputField
					value={profile.login}
					name="login"
					labelText="Login"
					type="text"
					placeholder="john_doe"
					error={errors.login}
					onChange={this.handleInput}
				/>

				<BirthDateInput
					labelText="Birthday"
					month={profile.birthdate.month}
					day={profile.birthdate.day}
					year={profile.birthdate.year}
					error={errors.birthdate}
					onChange={this.handleBirthdateInput}
				/>

				<SelectInputField
					name="gender"
					labelText="Gender"
					onChangeHandler={this.handleInput}
					defaultValue={profile.gender}
				>
					<option value="not specified">Not specified</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</SelectInputField>

				<SelectInputField
					name="searching_for"
					labelText="Searching for..."
					onChangeHandler={this.handleInput}
					defaultValue={profile.searching_for}
				>
					<option value="*">Male & Female</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</SelectInputField>

				<BaseInputField
					value={profile.bio}
					name="bio"
					labelText="Bio"
					type="textarea"
					placeholder="Tell us about yourself"
					error={errors.bio}
					onChange={this.handleInput}
				/>

				<TagsInputCard
					tags={tags}
					addTag={this.addTag}
					inputValue={tagInput}
					handleInput={this.handleTagInput}
				>
					{ this.renderTags(tags) }
				</ TagsInputCard>
				{ errors.tags && <div className="help is-danger">{errors.tags}</div> }

				<button
					className="button is-fullwidth"
					onClick={this.updateProfile}
				>
					Save changes
				</button>
			</div>
		);
	}

	renderTags(tags) {
		return tags.map((tag, index) =>
			<Tag
				className="is-light"
				key={index}
				index={index}
				onDelete={this.handleTagDelete}
				value={tag.value}
			/>
		);
	}

	renderMap(profile, errors) {
		const { lat, lng } = profile;
		const userLocation = {lat, lng}

		return (
			<div>
				<div className="field">
					<label className="label has-text-grey has-text-centered is-size-7">
						Geolocation
					</label>
					<MyGoogleMap
						googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBj7XDClRGcxA9xTV3KPIwyijuHODynh4w&v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<SpinLoad/>}
						center={ userLocation }
						showMarker="true"
						markerPos={ userLocation }
						containerElement={<div className="card" style={{ height: `400px` }} />}
						mapElement={<div style={{ height: `100%` }} />}
					/>
				</div>
				<button onClick={this.updateUserLocation} type="button" className="button is-fullwidth ">
					Update my location
				</button>
				<div className="field help has-text-centered is-danger">
					{errors.geolocation}
				</div>
			</div>
		);
	}

	render() {
		const { showModal } = this.state;
		const { errors, user, tagInput, numberOfPictures } = this.props.ProfileEditStore;
		const { profile, pictures, tags } = user;

		return(
			<div className="card">
				<header className="card-header">
					<p className="card-header-title is-centered">
						Edit profile
					</p>
				</header>
				<div className="card-content">
					{ showModal && this.renderModal() }
					
					{ this.renderUserPictureManager(pictures, numberOfPictures, errors) }

					<hr/>

					{this.renderBasicInfoFields(profile, tags, tagInput, errors)}

					<hr/>

					{this.renderMap(profile, errors)}
				</div>
			</div>
		);
	}
}

export default ProfileEditCard;
