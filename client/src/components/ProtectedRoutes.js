import React from 'react'
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';


@inject('UserStore', 'CommonStore') @observer
export default class ProtectedRoutes extends React.Component {
	render() {
		if (this.props.UserStore.currentUser) {
			return this.props.children
		} else {
			return <Redirect to="/" />;
		}
	}
}