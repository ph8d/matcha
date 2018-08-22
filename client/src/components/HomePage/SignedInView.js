import React from 'react';
import Api from '../../helpers/api';

class SignedInView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: []
		}
	}

	componentWillUnmount() {
		Api.utils.cancelLastRequest();
	}

	componentWillMount() {
		Api.request('GET', '/users')
			.then(response => {
				this.setState({ users: response.data });
			})
			.catch(error => {
				// console.error(error);
			})
	}

	render() {
		return (
			<section className="section">
				<div className="container">
					<table className="table is-bordered is-striped is-narrow is-hoverable">
						<thead>
							<tr>
							<th><abbr title="ID">ID</abbr></th>
								<th><abbr title="First Name">First Name</abbr></th>
								<th><abbr title="Last Name">Last Name</abbr></th>
								<th><abbr title="Login">Login</abbr></th>
								<th><abbr title="Email">Email</abbr></th>
								<th><abbr title="Joined">Joined</abbr></th>
							</tr>
						</thead>
						<tbody>
								{
									this.state.users.map(user => {
										return (
											<tr key={user.id}>
												<th>{user.id}</th>
												<td>{user.first_name}</td>
												<td>{user.last_name}</td>
												<td>{user.login}</td>
												<td>{user.email}</td>
												<td>{user.joined}</td>
											</tr>
										);
								})}
						</tbody>
					</table>
				</div>
			</section>
		);
	}
}

export default SignedInView;
