import React from 'react'
import { observer, inject } from 'mobx-react';
import BaseInputField from '../BaseInputField';
import TagsInputCard from '../TagsInputCard';
import Tag from '../Tag';


@inject('RegistrationStore') @observer
class ThirdStepForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleBioInput = this.handleBioInput.bind(this);
		this.handleTagInput = this.handleTagInput.bind(this);
		this.removeTag = this.removeTag.bind(this);
		this.addTag = this.addTag.bind(this);
	}

	preventFormSubmisson(e) {
		console.log('oops!');
		e.preventDefault();
	}

	handleBioInput(e) {
		this.props.RegistrationStore.setFieldValue(e.target.name, e.target.value);
	}

	handleTagInput(e) {
		this.props.RegistrationStore.setTagInput(e.target.value);
	}

	addTag(value) {
		this.props.RegistrationStore.addTag(value);
	}

	removeTag(e) {
		let tag = e.target.parentNode.children[0].innerHTML;
		this.props.RegistrationStore.removeTag(tag);
	}

	render() {
		let { user, errors, tagInput } = this.props.RegistrationStore;

		const tags = user.tags.map((tag, index) => 
			<Tag key={index} className="is-light has-text-weight-bold" value={tag} handleClick={this.removeTag} />
		);

		return (
			<form onSubmit={this.preventFormSubmisson}>
				<BaseInputField
					value={user.bio}
					name="bio"
					labelText="Bio"
					type="textarea"
					placeholder="Tell us about yourself"
					error={errors.bio}
					onChange={this.handleBioInput}
				/>
				<TagsInputCard tags={tags} addTag={this.addTag} inputValue={tagInput} handleInput={this.handleTagInput}>
					{tags}
				</TagsInputCard>
				{
					errors.tags ?
					<div className="help is-danger">{errors.tags}</div> :
					null
				}
			</form>
		);
	}
}

export default ThirdStepForm;