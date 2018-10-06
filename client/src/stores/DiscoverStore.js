import { observable, action, computed, toJS } from 'mobx'
import API from '../helpers/api';

class DiscoverStore {
	pullFromRecommendations = true;
	
	@observable filters = {
		distance: [0, 20],
		age: [18, 24],
		fame: [0, 500],
		tags: [],
	}
	
	@observable sortBy = "distance";

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

	@action setSortBy(field) {
		this.sortBy = field;
		this.pullProfiles();
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

	setPullFromRecommendations(status) {
		this.pullFromRecommendations = status;
	}


	pullProfiles() {
		const filters = this.filters;
		filters.sortBy = this.sortBy;

		if (this.pullFromRecommendations) {
			this._pullRecomendedProfiles(filters);
		} else {
			this._pullAllProfiles(filters);
		}
	}

	async _pullRecomendedProfiles(filters) {
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
