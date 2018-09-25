import React from 'react';
import MyGoogleMap from '../GoogleMaps/MyGoogleMap';
import { observer, inject } from 'mobx-react';
import SpinLoad from '../SpinLoad';


@inject('RegistrationStore') @observer
class GeolocationForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.RegistrationStore.getLocationWithNavigator();
	}
	
	render() {
		let { user, errors } = this.props.RegistrationStore;

		return (
			<div>
				<div className="field">
					<label className="label has-text-grey has-text-centered is-size-7">
						Geolocation
					</label>
					<MyGoogleMap
						googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBj7XDClRGcxA9xTV3KPIwyijuHODynh4w&v=3.exp&libraries=geometry,drawing,places"
						loadingElement={<SpinLoad/>}
						center={ user.geolocation }
						showMarker="true"
						markerPos={ user.geolocation }
						containerElement={<div className="card" style={{ height: `400px` }} />}
						mapElement={<div style={{ height: `100%` }} />}
					/>
				</div>
				<button onClick={this.handleClick} type="button" className="button is-fullwidth is-dark is-radiusless">
					Allow access to my location
				</button>
				<div className="field help has-text-centered is-danger">
					{errors.geolocation}
				</div>
			</div>
		);
	}
}

export default GeolocationForm;