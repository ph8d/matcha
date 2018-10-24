import React from 'react';
import BaseInputField from '../BaseInputField';
import { inject, observer } from 'mobx-react';

@inject('SettingsStore') @observer
class EmailCard extends React.Component {
    updateEmail(e) {
        const { SettingsStore } = this.props;
        SettingsStore.updateEmail();
    }

    render() {
        const { fields, errors } = this.props.SettingsStore;
        return (
            <div style={{ marginBottom: '2em' }} className="card">
                <header className="card-header">
                    <p className="card-header-title is-centered">
                        Change email
                    </p>
                </header>
                <div className="card-content">

                    <BaseInputField
                        value={fields.email}
                        name="email"
                        labelText="Email"
                        type="email"
                        placeholder="jhondoe@example.com"
                        error={errors.email}
                        onChange={this.props.inputHandler}
                    />

                    <button
                        className="button is-dark is-fullwidth"
                        onClick={this.updateEmail.bind(this)}
                    >
                        <span className="icon">
                            <i className="fas fa-save"></i>
                        </span>
                        <span>Save</span>
                    </button>
                </div>
            </div>
        )
    }
}

export default EmailCard;
