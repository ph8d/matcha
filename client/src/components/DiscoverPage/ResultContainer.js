import React from 'react';
import 'rc-slider/assets/index.css';
import ProfilePreview from './ProfilePreview';
import SpinLoad from '../SpinLoad';

const profileList = {
	'flexWrap': 'wrap',
	'justifyContent': 'center'
}

class ResultContainer extends React.Component {
	render() {
		const { profiles, isLoading } = this.props;

		if (isLoading) {
			return <SpinLoad/>
		} else {
			return (
				<div style={profileList} className="section is-flex">
					{
						profiles.map((profile, index) => 
							<ProfilePreview
								key={index}
								profile={profile}
							/>
						)
					}
				</div>
			);
		}
	}
}

export default ResultContainer;
