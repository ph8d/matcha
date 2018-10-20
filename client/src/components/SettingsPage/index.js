import React from 'react';
import SignedInLayout from '../Layouts/SignedInLayout';
import EmailCard from "./EmailCard";
import PasswordCard from './PasswordCard';
import { inject, observer } from 'mobx-react';

@inject('SettingsStore') @observer
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        const { SettingsStore } = this.props;
        SettingsStore.pullUserEmail();
    }

    handleInput(e) {
        const { SettingsStore } = this.props;
        SettingsStore.setFiledByName(e.target.name, e.target.value);
    }

    render() {
        return (
            <SignedInLayout>
                <EmailCard inputHandler={this.handleInput} />
                <PasswordCard inputHandler={this.handleInput} />
            </SignedInLayout>
        );
    }
}