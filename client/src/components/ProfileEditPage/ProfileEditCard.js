import React from 'react';
import SpinLoad from '../SpinLoad';
import MyGoogleMap from '../GoogleMaps/MyGoogleMap';
import BaseInputField from '../BaseInputField';
import TagsInputCard from '../TagsInputCard';
import Tag from '../Tag';
import SelectInputField from '../SelectInputField';
import BirthDateInput from '../BirthDateInput';
import InteractivePicture from './InteractivePicture';
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
		this.changeProfilePicture = this.changeProfilePicture.bind(this);
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
		this.locateUserWithNavigator = this.locateUserWithNavigator.bind(this);
		this.setUserLocation = this.setUserLocation.bind(this);
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

	locateUserWithNavigator(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.locateWithNavigator();
	}

	setUserLocation(data) {
		const { ProfileEditStore } = this.props;
		const lat = data.latLng.lat();
		const lng = data.latLng.lng();

		ProfileEditStore.setFieldValue('lat', lat);
		ProfileEditStore.setFieldValue('lng', lng);
	}

	updateProfile(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.updateProfile();
	}

	onFileChange(e) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.setErrors({ pictures: '' });

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
					console.error(error);
				});
		} else {
			ProfileEditStore.setErrors({ pictures: 'File is too big' });
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
			const { ProfileEditStore } = this.props;
			ProfileEditStore.setErrors({ pictures: 'Error occured, file is probably invalid.' });
		}

		this.closeModal();
	}

	changeProfilePicture(index) {
		const { ProfileEditStore } = this.props;
		ProfileEditStore.changeProfilePicture(index);
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
				<InteractivePicture
					key={index}
					src={picture.src}
					index={index}
					showButtons={index !== 0}
					onDeleteClick={this.deletePicture}
					onPrimaryAction={this.changeProfilePicture}
				/>
			);
		} else {
			return
		}
	}

	renderUserPictureManager(pictures, numberOfPictures, errors) {
		const status = numberOfPictures >= 5;

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
				<button disabled={status} onClick={() => { this.fileInput.current.click() }} className="button is-fullwidth">
					<span className="icon">
						<i className="fas fa-upload"></i>
					</span>
					<span>
						Upload a picture
					</span>
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
					addTag={this.addTag}
					inputValue={tagInput}
					handleInput={this.handleTagInput}
					error={errors.tags}
				>
					{ this.renderTags(tags) }
				</ TagsInputCard>

				{ this.renderMap(profile, errors) }
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
				value={tag}
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
						onMapClick={this.setUserLocation}
						loadingElement={<SpinLoad/>}
						center={ userLocation }
						showMarker="true"
						markerPos={ userLocation }
						containerElement={<div className="card" style={{ height: `400px` }} />}
						mapElement={<div style={{ height: `100%` }} />}
					/>
				</div>
				<button onClick={this.locateUserWithNavigator} type="button" className="button is-fullwidth ">
					<span className="icon">
						<i className="fas fa-map-marked-alt"></i>
					</span>
					<span>Find my location</span>
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
					<hr />
					<button
						className="button is-dark is-fullwidth"
						onClick={this.updateProfile}
					>
						<span className="icon">
							<i className="fas fa-save"></i>
						</span>
						<span>Save changes</span>
					</button>
				</div>
			</div>
		);
	}
}

export default ProfileEditCard;
