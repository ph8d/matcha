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

const request = (method, url, body = null, params = null) => {
	return axios.request({
		url: url,
		method: method,
		headers: authHeader(),
		data: body,
		params: params,
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
	verifyRecoveryReq: (hash) => {
		return request('GET', `/users/reset/${hash}`);
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
	getVisitHistory: () => {
		return request('GET', '/users/self/history');
	},
	updateProfile: (data) => {
		return request('POST', '/users/update/profile', data);
	},
	updateEmail: (email) => {
		return request('POST', '/users/update/email', { email })
	},
	updatePassword: (data) => {
		return request('POST', '/users/update/password', data);
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

const Profiles = {
	get: filters => {
		return request('GET', '/profiles', null, filters);
	},
	getRecommended: filters => {
		return request('GET', '/profiles/recommended', null, filters);
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
	Profiles,
	request,
	utils
};