document.addEventListener("DOMContentLoaded", function(event) {
	let registerForm = document.querySelector('#register-form');
	let btnSubmit = document.querySelector('#submit');

	registerForm.addEventListener('submit', function(event) {
		event.preventDefault();
		btnSubmit.setAttribute('disabled', '');

		sendFormData(registerForm, 'POST', '/users/register')
			.then(function(response) {
				document.querySelectorAll('.is-invalid').forEach(elem => {
					elem.classList.remove('is-invalid');
				});
				btnSubmit.removeAttribute('disabled');
	
				if (response.status === 200) {
					window.location.replace('/');
					// XHRSend('http://ip-api.com/json', 'GET')
					// 	.then(response => {
					// 		window.location.replace('/');
					// 	})
					// 	.catch(error => {
					// 		console.log(error);
					// 	});
				} else {
					let invalidFields = JSON.parse(response.body);
					for (var field in invalidFields) {
						if (invalidFields.hasOwnProperty(field)) {
							document.querySelector(`.${field}-feedback`).innerHTML = invalidFields[field];
							document.querySelector(`#${field}`).classList.add('is-invalid');
						}
					}
				}
			})
			.catch(function(error) {
				btnSubmit.removeAttribute('disabled');
				console.log(error);
			});
	});
});