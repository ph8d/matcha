import React from 'react';
import MainLayout from '../Layouts/MainLayout';
import SpinLoad from '../SpinLoad';
import FiltersMenu from './FiltersMenu';
import ResultContainer from './ResultContainer';
import { observer, inject } from 'mobx-react';
import './style.css';


@inject('DiscoverStore') @observer
export default class extends React.Component {
	componentDidMount() {
		const { DiscoverStore } = this.props;
		if (DiscoverStore.profiles.length === 0) {
			DiscoverStore.init();
			DiscoverStore.pullProfiles();
		}
	}

	render() {
		const { profiles, isLoading } = this.props.DiscoverStore;

		return (
			<MainLayout>
				<div className="columns is-centered is-gapless">
					<div className="column is-4 is-3-widescreen">
						<FiltersMenu />
					</div>
					<div className="column">
						<ResultContainer
							profiles={profiles}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</MainLayout>
		);
	}
}