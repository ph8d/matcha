import React from 'react'
import { observer, inject } from 'mobx-react';
import SpinLoad from '../SpinLoad';
import FirstStepForm from './FirstStepForm';
import SecondStepForm from './SecondStepForm';
import ThirdStepForm from './ThirdStepForm';
import FourthStepForm from './FourthStepForm';
import GeolocationForm from './GeolocationForm';


@inject('RegistrationStore', 'AuthStore', 'UserStore') @observer
class RegistrationView extends React.Component {

	prevStep() {
		this.props.RegistrationStore.prevStep();
	}

	nextStep() {
		this.props.RegistrationStore.nextStep();
	}

	async submitInfo() {
		const { RegistrationStore, AuthStore } = this.props;
		const response = await RegistrationStore.submitInfo(this.props.hash);
		if (response.status === 200) {
			RegistrationStore.clearLocalStore();
			AuthStore.message = {
				heading: "Success!",
				text: response.data.message
			}
			AuthStore.setMessageVisible(true);
			this.props.redirectToHome();
		} else {
			console.error('Some error occured while submiting user');
			console.log(response);
		}
	}

	renderRegistrationStep() {
		let { step } = this.props.RegistrationStore;
		switch(step) {
			case 0:
				return <SpinLoad />; /* Loading user data */
			case 1:
				return <FirstStepForm />;
			case 2:
				return <SecondStepForm />;
			case 3:
				return <ThirdStepForm />;
			case 4:
				return <FourthStepForm />;
			case 5:
				return <GeolocationForm />;
			default:
				return <h1>Error, invalid registration step!</h1>;
		}
	}

	renderBackButton() {
		let { step } = this.props.RegistrationStore;
		if (step < 2) return;
		return (
			<button className="button is-radiusless is-white" onClick={this.prevStep.bind(this)}>
				<span className="icon is-small">
					<i className="fas fa-arrow-left"></i>
				</span>
			</button>
		);
	}

	renderContinueButton() {
		const { isValidating } = this.props.RegistrationStore;
		const status = (isValidating) && 'disabled';
		const loadingClass = (isValidating) && 'is-loading';

		return (
			<button disabled={status} className={`button ${loadingClass} is-radiusless is-dark`} onClick={this.nextStep.bind(this)}>
				<span>Continue</span>
				<span className="icon is-small">
					<i className="fas fa-arrow-right"></i>
				</span>
			</button>
		);
	}

	renderSubmitButton() {
		const { isValidating } = this.props.RegistrationStore;
		const status = (isValidating) && 'disabled';
		const loadingClass = (isValidating) && 'is-loading';

		return (
			<button disabled={status} className={`button ${loadingClass} is-radiusless is-success`} onClick={this.submitInfo.bind(this)}>
				<span>Submit</span>
			</button>
		);
	}

	renderNavButtons() {
		const { step } = this.props.RegistrationStore;
		if (step < 1) return;
		return (
			<div>
				<hr/>
				<div className="level is-mobile">
					<div className="level-left">
						<div className="level-item">
							{ this.renderBackButton() }
						</div>
					</div>
					<div className="level-right">
						<div className="level-item">
							{
								this.props.RegistrationStore.step === 5 ?
								this.renderSubmitButton() :
								this.renderContinueButton()
							}
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<section className="hero is-bold is-white">
				<div className="hero-body">
					<div className="container">
						<div className="columns">
							<div className="column is-6 is-offset-3">
								<div className="card">
									<header className="card-header">
										<p className="card-header-title is-centered">Registration</p>
									</header>
									<div className="card-content">
										{this.renderRegistrationStep()}
										{this.renderNavButtons()}
									</div>
								</div>	
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default RegistrationView;