import { observable, action } from 'mobx';
import UserStore from './UserStore';
import API from '../helpers/api';

class DiscoverStore {
	@observable searchMode = 'recommended';
	
	@observable filters = {
		gender: "female",
		searching_for: "female",
		distance: [0, 10],
		age: [18, 24],
		fame: [0, 500],
		tags: [],
		sortBy: "distance"
	}

	@observable isLoading = false;
	@observable profiles = [];

	@observable tagInput = '';

	@observable errors = {}

	@action setIsLoading(status) {
		this.isLoading = status;
	}
	
	@action setFilter(name, value) {
		this.filters[name] = value;
	}

	@action setProfiles(profiles) {
		this.profiles = profiles;
	}
	
	@action unsetProfiles() {
		this.profiles = [];
	}
	
	@action setTagInput(value) {
		if (value.length > 30) {
			return this.errors.tags = 'Tag is too long.';
		} else if (!RegExp(/^[\w\- ]*$/).test(value)) {
			return this.errors.tags = 'Invalid symbol.'
		}
		
		this.tagInput = value;
		this.errors.tags = '';
	}
	
	@action addTag() {
		if (this._isValidTag()) {
			const tag = this.tagInput.trim();
			this.filters.tags.push(tag);
			this.tagInput = '';
			this.pullProfiles();
		}
	}
	
	@action deleteTag(index) {
		this.filters.tags.splice(index, 1);
		this.pullProfiles();
	}

	@action setSearchMode(mode) {
		this.searchMode = mode;
		if (mode === 'recommended') {
			this.init();
		}
		this.pullProfiles();
	}

	@action init() {
		const { gender, searching_for } = UserStore.currentUser.profile;
		const filters = {
			gender: searching_for,
			searching_for: gender,
			distance: [0, 25],
			age: [18, 24],
			fame: [0, 500],
			tags: [],
			sortBy: "distance",
		}
		console.log(filters);
		this.filters = filters;
	}

	pullProfiles() {
		if (this.searchMode === 'advanced') {
			this._pullAllProfiles(this.filters);
		} else {
			this._pullRecommendedProfiles(this.filters); 
		}
	}


	async _pullRecommendedProfiles(filters) {
		this.setIsLoading(true);
		const response = await API.Profiles.getRecommended(filters);
		if (response.status === 200) {
			this.setProfiles(response.data);
		} else {
			console.error(response);
		}
		this.setIsLoading(false);
	}

	async _pullAllProfiles(filters) {
		this.setIsLoading(true);
		const response = await API.Profiles.get(filters);
		if (response.status === 200) {
			this.setProfiles(response.data);
		} else {
			console.error(response);
		}
		this.setIsLoading(false);
	}

	_isValidTag() {
		if (!this.tagInput) return false;

		if (this.filters.tags.includes(this.tagInput)) {
			this.errors.tags = 'This tag already exists.';
			return false;
		}
		if (this.filters.tags.length + 1 > 5) {
			this.errors.tags = 'Maximum tags for filter is 5.';
			return false;
		}

		return true;
	}

}

export default new DiscoverStore();
