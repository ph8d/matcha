import axios from 'axios';

axios.defaults.validateStatus = status => {
	return status >= 200 && status < 500;
}

const authHeader = () => {
	const token = localStorage.getItem('jwt');
	if (token) {
		const headers = {
			'Authorization': `bearer ${token}`
		};
		return headers;
	}
	return null;
}

const request = (method, url, body) => {
	return axios.request({
		url: url,
		method: method,
		headers: authHeader(),
		data: body || null
	});
}

const Auth = {
	current: () => {
		return request('GET', '/user');
	},
	login: (credentials) => {
		return request('POST', '/users/login', credentials);
	},
	register: (user) => {
		return request('POST', '/users/register');
	}
};

export default {
	Auth,
	request
};