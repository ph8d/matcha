import React from 'react';
import { inject, observer } from 'mobx-react';
import BaseInputField from '../BaseInputField';

@inject('AuthStore') @observer
class PasswordResetView extends React.Component {
	constructor(props) {
		super(props);
		this.handleInput = this.handleInput.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		// I need to check if password reset token (hash) is valid
		// and if it's not i should redirect to the home page
	}

	handleInput(e) {
		this.props.AuthStore.setFieldValue(e.target.name, e.target.value);
	}

	onSubmit(e) {
		e.preventDefault();
		let hash = this.props.hash;
		this.props.AuthStore.passwordReset(hash)	
			.then(response => {
				if (response.status === 200) {
					this.props.redirectToHomePage();
				}
			});
	}

	render() {
		const { values, errors, isLoading } = this.props.AuthStore;
		
		let btnStatus = isLoading ? 'disabled' : '';
		let btnLoadingClass = isLoading ? 'is-loading' : '';
	
		return (
			<section className="hero is-medium is-bold is-white">
				<div className="hero-body">
					<div className="columns is-centered">
						<div className="column is-4">
							<div className="card">
								<header className="card-header">
									<p className="card-header-title">Password reset</p>
								</header>
								<div className="card-content">
									<form onSubmit={this.onSubmit}>
										<BaseInputField
											name="password"
											labelText="New password"
											type="password"
											value={values.password}
											error={errors.password}
											onChange={this.handleInput}
										/>

										<BaseInputField
											name="password_confirm"
											labelText="Confirm new password"
											type="password"
											value={values.password_confirm}
											error={errors.password_confirm}
											onChange={this.handleInput}
										/>
										<hr/>
										<button disabled={btnStatus} id="submit" className={`button is-radiusless is-dark is-medium is-fullwidth ${btnLoadingClass}`} type="submit">Submit</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default PasswordResetView;
