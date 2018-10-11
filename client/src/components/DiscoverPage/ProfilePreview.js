import React from 'react';
import { Link } from 'react-router-dom';

class ProfilePreview extends React.Component {
	render() {
		const { picture, first_name, last_name, login, age } = this.props.profile;

		return (
			<Link to={`/profile/${login}`}>
				<div className="card" style={{'margin': '10px', 'maxWidth': '256px'}}>
					<figure className="image">
						<img src={picture} alt="avatar" />
						<p
							className="has-text-light has-text-weight-bold has-shadow is-size-5"
							style={{'position': 'absolute', 'bottom': '2%', 'left': '3%', 'textShadow': '0px 1px 2px rgba(0,0,0,0.8)'}}
						>
							{`${first_name} ${last_name}, ${age}`}
						</p>
					</figure>
				</div>
			</Link>
		);
	}
}

export default ProfilePreview;
