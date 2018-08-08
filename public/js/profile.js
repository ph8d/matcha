var map, infoWindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
	});

	infoWindow = new google.maps.InfoWindow;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
			handleLocationError(); // Do something
		})
	} else {
		// browser does not support Geolocation
		handleLocationError()
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	var userInterests = [];
	var btnAdd = document.querySelector('#addInterest');

	function getUserInterests() {
		var XHR = new XMLHttpRequest();

		XHR.addEventListener("load", function(event) {
			let response = JSON.parse(event.target.responseText);
			response.interests.forEach(function(interest) {
				userInterests.push(interest.value);
			});
			btnAdd.removeAttribute('disabled');
		});
		XHR.addEventListener("error", function(event) {
			console.log('Oops! Something went wrong.');
			btnAdd.removeAttribute('disabled');
		});
	
		XHR.open('GET', '/interests/');
		XHR.send();
		btnAdd.setAttribute('disabled', '');
	}

	getUserInterests();

	document.querySelector('#interest-form').addEventListener('submit', function(event) {
		event.preventDefault();

		var inputField = document.querySelector('input[name=interest]');
		var reg = new RegExp(/^[A-Za-z0-9]{1,32}$/);

		if (!reg.test(inputField.value)) return;
		if (userInterests.indexOf(inputField.value) !== -1) return;

		btnAdd.setAttribute('disabled', '');
		let interestsForm = document.querySelector('#interest-form');

		sendFormData(interestsForm, 'POST', '/interests/html')
			.then(function(response) {
				userInterests.push(inputField.value);
				document.querySelector(".interests-container").insertAdjacentHTML('beforeend', response.body);
				inputField.value = '';
				btnAdd.removeAttribute('disabled');
			})
			.catch(function(error) {
				console.error(error);
				btnAdd.removeAttribute('disabled');
			});
	});

	document.querySelector('#upload-form').addEventListener('submit', function(event) {
		event.preventDefault();

		let uploadForm = document.querySelector('#upload-form');
		let file = document.querySelector('#upload-picture').value

		if (!file) return;

		sendFormData(uploadForm, 'POST', '/picture')
			.then(function(response) {

			})
			.catch(function(error) {
				console.error(error);
			});
	});

	document.querySelector('.interests-container').addEventListener('click', function(event) {
		if (event.target.id !== 'remove-interest') return;

		var interest;
		event.target.parentNode.childNodes.forEach(node => {
			if (node.className === 'interest-value') {
				interest = node.innerHTML;
			}
		});

		var XHR = new XMLHttpRequest();
		XHR.addEventListener("load", function(event) {
			if (event.target.status === 200) {
				userInterests.splice(userInterests.indexOf(interest));
			}
		});
		XHR.addEventListener("error", function(event) {
			console.log('Oops! Something went wrong.');
		});

		XHR.open('DELETE', '/interests');
		XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		XHR.send('interest=' + interest);

		// removing before the server response is not a good idea
		event.target.parentNode.parentNode.removeChild(event.target.parentNode); 
	});
});