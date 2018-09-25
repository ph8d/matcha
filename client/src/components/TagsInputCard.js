import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';


class TagsInputCard extends React.Component {
	handleKeyPress(e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			return this.props.addTag(e.target.value);
		}
	}

	handleButtonClick(e) {
		this.props.addTag(e.target.value);
	}

	renderPlaceholder() {
		return <p className="has-text-centered has-text-grey-light">e.g. cats, game of thrones, coding...</p>;
	}
	
	render() {
		return (
			<div className="field">
				<label className="label has-text-grey is-size-7">Interests / Tags</label>
				<div className="card">
					<div className="card-content">
						<div className="tags">
							{this.props.children || this.renderPlaceholder()}
						</div>
					</div>
					<footer className="card-footer">
						<input
							className="input is-white is-radiusless is-shadowless"
							type="text"
							placeholder="What are you interested in?"
							onKeyDown={this.handleKeyPress.bind(this)}
							value={this.props.inputValue}
							onChange={this.props.handleInput}
						/>
						<button onClick={this.handleButtonClick.bind(this)} type="button" className="button is-radiusless is-white">
							<span className="icon is-small"><i className="fas fa-plus"></i></span>
						</button>
					</footer>
				</div>
			</div>
		);
	}
}

TagsInputCard.propTypes = {
	tags: PropTypes.array,
	handleInput: PropTypes.func.isRequired,
	addTag: PropTypes.func.isRequired,
	onTagDelete: PropTypes.func
};

export default TagsInputCard;