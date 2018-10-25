import React from 'react';
import Slider from 'rc-slider';
import TagsInputCard from '../TagsInputCard';
import Tag from '../Tag';
import SelectInputField from '../SelectInputField';
import { inject, observer } from 'mobx-react';
const Range = Slider.createSliderWithTooltip(Slider.Range);

@inject('DiscoverStore') @observer
class FiltersMenu extends React.Component {
	constructor(props) {
		super(props);
		this.pullProfiles = this.pullProfiles.bind(this);
		this.handleTagInput = this.handleTagInput.bind(this);
		this.addTag = this.addTag.bind(this);
		this.handleTagDelete = this.handleTagDelete.bind(this);
		this.changeSortOrder = this.changeSortOrder.bind(this);
		this.changeSearchMode = this.changeSearchMode.bind(this);
		this.setFilterAndPullProfiles = this.setFilterAndPullProfiles.bind(this);
	}

	changeSearchMode(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.setSearchMode(e.target.value);
	}

	pullProfiles(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.pullProfiles();
	}

	setFilterAndPullProfiles(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.setFilter(e.target.name, e.target.value);
		this.pullProfiles();
	}

	changeSortOrder(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.setSortBy(e.target.value);
	}

	handleTagInput(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.setTagInput(e.target.value);
	}

	addTag(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.addTag();
	}

	handleTagDelete(index) {
		const { DiscoverStore } = this.props;
		DiscoverStore.deleteTag(index);
	}

	formatAge(value) {
		if (value === 50) {
			return `${value}+`;
		}
		return `${value}`;
	}

	formatFame(value) {
		if (value === 250) {
			return `${value}+`;
		}
		return `${value}`;
	}

	formatDistance(value) {
		if (value === 100) {
			return `${value}+ km`;
		}
		return `${value} km`;
	}

	renderTags(tags) {
		return tags.map((tag, index) =>
			<Tag
				className="is-light"
				key={index}
				index={index}
				onDelete={this.handleTagDelete}
				value={tag}
			/>
		);
	}

	render() {
		const { searchMode, tagInput, filters } = this.props.DiscoverStore;

		return(
			<div className="card">
				<div className="card-content">
					<SelectInputField
						name="searchMode"
						labelText={'Show'}
						defaultValue={searchMode}
						onChangeHandler={this.changeSearchMode}
					>
						<option value={"recommended"}>Recomended profiles</option>
						<option value={"advanced"}>All profiles</option>
					</SelectInputField>
					<SelectInputField
						name="sortBy"
						labelText={'Sort by'}
						defaultValue={filters.sortBy}
						onChangeHandler={this.setFilterAndPullProfiles}
					>
						<option value={"distance"}>Distance</option>
						<option value={"tags"}>Matched tags</option>
						<option value={"age"}>Age</option>
						<option value={"fame"}>Fame</option>
					</SelectInputField>
					<hr/>
					<SelectInputField
						name="gender"
						labelText={'Gender'}
						defaultValue={filters.gender}
						isDisabled={searchMode !== 'advanced'}
						onChangeHandler={this.setFilterAndPullProfiles}
					>
						<option value={"male"}>Male</option>
						<option value={"female"}>Female</option>
						<option value={"*"}>Any</option>
					</SelectInputField>
					<SelectInputField
						name="searching_for"
						labelText={'Interested in'}
						defaultValue={filters.searching_for}
						isDisabled={searchMode !== 'advanced'}
						onChangeHandler={this.setFilterAndPullProfiles}
					>
						<option value={"male"}>Male</option>
						<option value={"female"}>Female</option>
						<option value={"*"}>Male & Female</option>
						<option value={"any"}>Any</option>
					</SelectInputField>
					<div className="field">
						<label className="label is-size-7 has-text-grey">Distance</label>
						<div className="control">
							<Range
								min={0}
								max={100}
								value={filters.distance}
								tipFormatter={this.formatDistance}
								pushable={1}
								onChange={value => this.props.DiscoverStore.setFilter('distance', value)}
								onAfterChange={this.pullProfiles}
							/>
						</div>
					</div>
					<div className="field">
						<label className="label is-size-7 has-text-grey">Age</label>
						<div className="control">
							<Range
								min={18}
								max={50}
								value={filters.age}
								tipFormatter={this.formatAge}
								pushable={1}
								onChange={value => this.props.DiscoverStore.setFilter('age', value)}
								onAfterChange={this.pullProfiles}
							/>
						</div>
					</div>
					<div className="field">
						<label className="label is-size-7 has-text-grey">Fame</label>
						<div className="control">
							<Range
								min={0}
								max={250}
								value={filters.fame}
								tipFormatter={this.formatFame}
								pushable={10}
								onChange={value => this.props.DiscoverStore.setFilter('fame', value)}
								onAfterChange={this.pullProfiles}
							/>
						</div>
					</div>
					<TagsInputCard
						addTag={this.addTag}
						inputValue={tagInput}
						handleInput={this.handleTagInput}
					>
						{ this.renderTags(filters.tags) }
					</ TagsInputCard>
				</div>
			</div>
		);
	}
}

export default FiltersMenu;
