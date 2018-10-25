import React from 'react'
import { observer, inject } from 'mobx-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import imgHelpers from '../../helpers/imgHelpers';


@inject('RegistrationStore') @observer
class FourthStepForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgIsLoading: true,
			modalStatus: '',
			selectedFile: '',
			originalSrc: '',
		}

		this.onFileChange = this.onFileChange.bind(this);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.saveImage = this.saveImage.bind(this);
	}

	showModal() {
		this.setState({ modalStatus: 'is-active' });
	}

	closeModal(e) {
		this.setState({ modalStatus: '' });
	}

	onFileChange(e) {
		const file = e.target.files[0];
		e.target.value = '';
		this.setState({ selectedFile: file });
		if (this.props.RegistrationStore.isValidPicture(file)) {
			imgHelpers.imgFileToBase64(file)
				.then(src => {
					this.setState({ originalSrc: src });
					this.showModal();
				})
				.catch(error => {
					console.error(error);
				})
		}
	}

	saveImage(e) {
		const { RegistrationStore } = this.props;
		const { selectedFile } = this.state;
		this.setState({ imgIsLoading: true });

		const canvas = this.cropper.getCroppedCanvas();
		if (canvas && canvas.width > 0 && canvas.height > 0) {
			const croppedSrc = canvas.toDataURL('image/jpeg', 1);
			const croppData = this.cropper.getData();
			RegistrationStore.setPicture(selectedFile, croppedSrc, croppData);
			this.setState({ imgIsLoading: false });
		} else {
			let error = [{ fieldName: 'picture', msg: 'Error occured, file is probably invalid.' }];
			RegistrationStore.setErrors(error);
		}
		this.closeModal();
	}

	renderModal() {
		const { originalSrc } = this.state;

		return (
			<div className={`modal ${this.state.modalStatus}`}>
				<div onClick={this.closeModal} className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Crop your photo</p>
					</header>
					<section className="modal-card-body">
						<Cropper
							ref={el => this.cropper = el}
							src={originalSrc}
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

	render() {
		const { picture, errors } = this.props.RegistrationStore;
		const finalPicture = picture.src || picture.placeholder;

		return (
			<form>
				{this.renderModal()}
				<div className="field">
					<label className="label has-text-grey has-text-centered is-size-7">
						Profile picture
					</label>
					<div className="card">
						<div className="card-image">
							<figure className="image">
								<img src={finalPicture} alt="Avatar" />
							</figure>
						</div>
					</div>
				</div>
				<div className="field help is-centered is-danger">{errors.picture}</div>
				<div className="field">
					<div className="file is-centered">
						<label className="file-label">
							<input onChange={this.onFileChange} className="file-input" type="file" name="avatar" accept="image/*" />
							<span className="file-cta">
								<span className="file-icon">
									<i className="fas fa-upload"></i>
								</span>
								<span className="file-label">
									Choose a photo
								</span>
							</span>
						</label>
					</div>
				</div>
			</form>
		);
	}
};

export default FourthStepForm;