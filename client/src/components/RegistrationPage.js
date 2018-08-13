import React from 'react';
import RegistrationForm from './RegistrationForm';


class RegistrationPage extends React.Component {
	render() {
		return (
			<div className="container my-4">
				<div className="card shadow-sm">
					<h5 className="card-header">Register</h5>
					<div className="card-body">
						<RegistrationForm />
					</div>
				</div>
			</div>
		);
	}
}

export default RegistrationPage;
