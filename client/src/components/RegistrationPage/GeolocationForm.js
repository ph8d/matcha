import React from 'react';
import MyGoogleMap from '../GoogleMaps/MyGoogleMap';
import { observer, inject } from 'mobx-react';
import SpinLoad from '../SpinLoad';


@inject('RegistrationStore') @observer
class GeolocationForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.setUserLocation = this.setUserLocation.bind(this);
	}

	handleClick() {
		this.props.RegistrationStore.getLocationWithNavigator();
	}

	setUserLocation(data) {
		const { RegistrationStore } = this.props;
		const location = {
			lat: data.latLng.lat(),
			lng: data.latLng.lng()
		}
		RegistrationStore.setGeolocation(location);
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
						onMapClick={this.setUserLocation}
						loadingElement={<SpinLoad/>}
						center={ user.geolocation }
						showMarker="true"
						markerPos={ user.geolocation }
						containerElement={<div className="card" style={{ height: `400px` }} />}
						mapElement={<div style={{ height: `100%` }} />}
					/>
				</div>
				<button onClick={this.handleClick} type="button" className="button is-fullwidth is-radiusless">
					<span className="icon">
						<i className="fas fa-map-marked-alt"></i>
					</span>
					<span>Find my location</span>
				</button>
				<div className="field help has-text-centered is-danger">
					{errors.geolocation}
				</div>
			</div>
		);
	}
}

export default GeolocationForm;