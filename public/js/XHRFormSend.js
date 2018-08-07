function sendFormData(form, method, url) {
	return new Promise((resolve, reject) => {
		var XHR = new XMLHttpRequest();
		var formData = new FormData(form);

		XHR.addEventListener("load", function(event) {
			resolve({
				body: event.target.responseText,
				status: event.target.status
			});
		});
		XHR.addEventListener("error", function(event) {
			reject(new Error(`Somthing went wrong with XHR request to ${url}`));
		});

		XHR.open(method, url);
		XHR.send(formData);
	});
}