import React from 'react';
import BaseInputField from '../BaseInputField';
import { inject, observer } from 'mobx-react';

@inject('SettingsStore') @observer
class PasswordCard extends React.Component {
    changePassword(e) {
        e.preventDefault();
        this.props.SettingsStore.updatePassword();
    }

    render() {
        const { fields, errors, isLoading } = this.props.SettingsStore;
        return (
            <form onSubmit={this.changePassword.bind(this)}>
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title is-centered">
                            Change password
                        </p>
                    </header>
                    <div className="card-content">
                        <BaseInputField
                            value={fields.currentPassword}
                            name="currentPassword"
                            labelText="Current password"
                            type="password"
                            error={errors.currentPassword}
                            onChange={this.props.inputHandler}
                        />

                        <BaseInputField
                            value={fields.newPassword}
                            name="newPassword"
                            labelText="New password"
                            type="password"
                            error={errors.newPassword}
                            onChange={this.props.inputHandler}
                        />

                        <BaseInputField
                            value={fields.confirm}
                            name="confirm"
                            labelText="Confirm new password"
                            type="password"
                            error={errors.confirm}
                            onChange={this.props.inputHandler}
                        />

                        <button
                            disabled={isLoading}
                            className={`button ${ isLoading && 'is-loading'} is-dark is-fullwidth`}
                            type="submit"
                        >
                            <span className="icon">
                                <i className="fas fa-save"></i>
                            </span>
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default PasswordCard;
