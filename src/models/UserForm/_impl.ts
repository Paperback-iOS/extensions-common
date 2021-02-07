import {UserForm, FormObject} from '.'

const _global = global as any

_global.createUserForm = function (userForm: UserForm): UserForm {
    return userForm
}

_global.createFormObject = function (formObject: FormObject): FormObject {
    return formObject
}