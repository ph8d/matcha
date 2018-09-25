import axios from 'axios';

axios.defaults.validateStatus = status => {
	return status >= 200 && status < 500;
}

const CancelToken = axios.CancelToken;
var cancelRequest;

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

const User = {
	getSelf: () => {
		return request('GET', '/users/self');
	},
	update: (data) => {
		return request('POST', '/users/update', data);
	},
	exists: (login) => {
		return request('GET', `/users/exists/${login}`);
	},
	createProfile: (hash, data) => {
		return request('POST', `/users/profile/${hash}`, data);
	},
	get: login => {
		return request('GET', `/users/${login}`); 
	},
	like: login => {
		return request('POST', `/users/${login}/like`);
	},
	unlike: login => {
		return request('DELETE', `/users/${login}/like`);
	},
	block: login => {
		return request('POST', `/users/${login}/block`);
	},
	unblock: login => {
		return request('DELETE', `/users/${login}/block`);
	},
	report: (login, reason) => {
		return request('POST', `/users/${login}/report`, { reason });
	}
}

const Pictures = {
	upload: data => {
		return request('POST', '/pictures/', data);
	},
	delete: id => {
		return request('DELETE', `/pictures/${id}`)
	}
}

const Conversations = {
	getPreviews: () => {
		return request('GET', '/conversations');
	},
	get: (login) => {
		return request('GET', `/conversations/${login}`);
	}
}

const utils = {
	cancelLastRequest: () => {
		return cancelRequest();
	}
}

export default {
	Auth,
	User,
	Conversations,
	Pictures,
	request,
	utils
};