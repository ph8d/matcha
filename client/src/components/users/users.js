import React, { Component } from 'react';
import './users.css';

class Users extends Component {

  constructor() {
    super();
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({users}, () => console.log('Fetched users...', users)))
      .catch(error => console.error);
  }

  render() {
    return (
      <div>
		  <h2>Users</h2>
      <ul>
        {this.state.users.map(user =>
          <li key={user.id}>{user.first_name} {user.last_name} - {user.login}</li>
        )}
      </ul>
      </div>
    );
  }
}

export default Users;
