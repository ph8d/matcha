import { observable, action } from 'mobx';
import UserStore from './UserStore';
import API from '../helpers/api';

class SettingsStore {    
    _originalEmail = '';

    @observable isLoading = false;

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

    @action setIsLoading(status) {
        this.isLoading = status;
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

    @action resetPasswordForm() {
        this.fields.currentPassword = '';
        this.fields.newPassword = '';
        this.fields.confirm = '';
    }

    pullUserEmail() {
        const { email } = UserStore.currentUser;
        this.setFiledByName('email', email); 
        this._originalEmail = email;
    }

    async updateEmail() {
        this.setIsLoading(true);

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

        this.setIsLoading(false);
    }

    async updatePassword() {
        this.setIsLoading(true);

        const { currentPassword, newPassword, confirm } = this.fields;
        const response = await API.User.updatePassword({ currentPassword, newPassword, confirm });
        if (response.status !== 200) {
            this.setErrors(response.data.errors);
        } else {
            this.resetPasswordForm();
        }

        this.setIsLoading(false);
    }

}

export default new SettingsStore();
