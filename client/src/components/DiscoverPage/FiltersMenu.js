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
		this.state = {
			tagInput: '',
			tagError: ''
		}

		this.pullProfiles = this.pullProfiles.bind(this);
		this.handleTagInput = this.handleTagInput.bind(this);
		this.addTag = this.addTag.bind(this);
		this.handleTagDelete = this.handleTagDelete.bind(this);
		this.changeSortOrder = this.changeSortOrder.bind(this);
	}

	pullProfiles(e) {
		const { DiscoverStore } = this.props;
		DiscoverStore.pullProfiles();
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
		if (value === 1000) {
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
		const { tagInput, filters, sortBy } = this.props.DiscoverStore;

		return(
			<div className="card">
				<div className="card-content">
					<div className="field">
						<button className="button is-white">
							<span className="has-text-weight-bold">FILTERS</span>
							<span className="icon">
								<i className="fas fa-sliders-h"></i>
							</span>
						</button>
					</div>
					<div className="field">
						<label className="label is-size-7">Distance</label>
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
						<label className="label is-size-7">Age</label>
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
						<label className="label is-size-7">Fame</label>
						<div className="control">
							<Range
								min={0}
								max={1000}
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
					<SelectInputField
						name="sortBy"
						labelText={'Sort by'}
						defaultValue={sortBy}
						onChangeHandler={this.changeSortOrder}
					>
						<option value={"distance"}>Distance</option>
						<option value={"tags"}>Maximum of common tags</option>
						<option value={"age"}>Age</option>
						<option value={"fame"}>Fame</option>
					</SelectInputField>
				</div>
			</div>
		);
	}
}

export default FiltersMenu;
