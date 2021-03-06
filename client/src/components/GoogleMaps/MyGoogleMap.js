import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import styles from './styles';


const MyGoogleMap = withScriptjs(withGoogleMap(props =>
	<GoogleMap
		defaultZoom={ 12 }
		defaultCenter={{ lat: -34.397, lng: 150.644 }}
		center={ props.center }
		defaultOptions={{ disableDefaultUI: true, styles: styles.wy }}
		onClick={props.onMapClick}
	>
		{ props.showMarker && <Marker title="Current location" position={ props.markerPos } /> }
	</GoogleMap>
));

export default MyGoogleMap;