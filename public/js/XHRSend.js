function XHRSend(url, method, body, header) {
	return new Promise((resolve, reject) => {
		var XHR = new XMLHttpRequest();
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
		if (header) {
			XHR.setRequestHeader(header);
		}
		if (body) {
			XHR.send(body);
		} else {
			XHR.send();
		}
	});
}