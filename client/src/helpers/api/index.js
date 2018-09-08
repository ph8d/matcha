import axios from 'axios';

axios.defaults.validateStatus = status => {
	return status >= 200 && status < 500;
}

const CancelToken = axios.CancelToken;
var cancelRequest;

const authHeader = () => {
	const token = localStorage.getItem('jwt');
	if (token) {
		console.log('setting token');
		const headers = {
			'Authorization': `bearer ${token}`
		};
		return headers;
	}
	return null;
}

const request = (method, url, body = null) => {
	return axios.request({
		url: url,
		method: method,
		headers: authHeader(),
		data: body,
		cancelToken: new CancelToken(function executor(c) {
			cancelRequest = c;
		})
	});
}

const Auth = {
	login: (credentials) => {
		return request('POST', '/users/login', credentials);
	},
	register: (user) => {
		return request('POST', '/users/register', user);
	},
	verify: (hash) => {
		return request('GET', `/users/verify/${hash}`);
	},
	recovery: (email) => {
		return request('POST', '/users/recovery', { email });
	},
	reset: (data) => {
		return request('POST', '/users/reset', data);
	}
};

const Users = {
	exists: (login) => {
		return request('GET', `/users/exists/${login}`);
	},
	createProfile: (hash, data) => {
		return request('POST', `/users/profile/${hash}`, data);
	},
	getSelf: () => {
		return request('GET', '/users/self');
	}
}

const utils = {
	cancelLastRequest: () => {
		return cancelRequest();
	}
}

export default {
	Auth,
	Users,
	request,
	utils
};