import React from 'react';
import SignedInLayout from '../Layouts/SignedInLayout';
import NotificationListCard from './NotificationListCard';

export default class extends React.Component {
	render() {
		return (
			<SignedInLayout>
				<NotificationListCard/>
			</SignedInLayout>
		);
	}
}
