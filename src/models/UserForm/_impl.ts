import {ComboFieldObject, PickerFieldObject, TextFieldObject, ToggleFieldObject, UserForm} from '.'

const _global = global as any

_global.createUserForm = function (userForm: UserForm): UserForm {
    return userForm
}

_global.createTextFieldObject = function (textField: TextFieldObject): TextFieldObject {
    return textField
}

_global.createToggleFieldObject = function (toggleField: ToggleFieldObject): ToggleFieldObject {
    return toggleField
}

_global.createPickerFieldObject = function (pickerField: PickerFieldObject): PickerFieldObject {
    return pickerField
}

_global.createComboFieldObject = function (comboField: ComboFieldObject): ComboFieldObject  {
    return comboField
}

