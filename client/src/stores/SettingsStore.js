import { observable, action } from 'mobx';
import UserStore from './UserStore';
import API from '../helpers/api';

class SettingsStore {    
    _originalEmail = '';

    @observable fields = {
        email: '',
        currentPassword: '',
        newPassword: '',
        confirm: ''
    }

    @observable errors = {
        email: '',
        currentPassword: '',
        newPassword: '',
        confirm: ''
    }

    @action setFiledByName(name, value) {
        this.fields[name] = value;
        this.errors[name] = '';
    }

    @action setErrors(errors = []) {
        errors.forEach(error => {
            console.log(error);
            this.errors[error.fieldName] = error.msg;
        })
    }

    pullUserEmail() {
        const { email } = UserStore.currentUser;
        this.setFiledByName('email', email); 
        this._originalEmail = email;
    }

    async updateEmail() {
        const { email } = this.fields;
        if (email && email !== this._originalEmail) {
            const response = await API.User.updateEmail(email);
            if (response.status !== 200) {
                this.setErrors(response.data.errors);
            } else {
                UserStore.updateUser({ email });
                this._originalEmail = email;
            }
        }
    }

    updatePassword() {

    }

    validateEmail() {

    }

    validatePassword() {

    }

}

export default new SettingsStore();
