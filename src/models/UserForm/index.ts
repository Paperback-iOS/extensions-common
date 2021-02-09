export interface UserForm {
    formElements: FormObject[]
}

export interface FormObject {
    id: string
    userReadableTitle: string
    userResponse?: any
}

export interface TextFieldObject extends FormObject {
    placeholderText: string
}

export interface ToggleFieldObject extends FormObject {
    // Blank - App consumes this for typing data
}

export interface PickerFieldObject extends FormObject {
    values: string[]
}

export interface ComboFieldObject extends FormObject {
    values: string[]
}


declare global {
    function createUserForm(userForm: UserForm): UserForm 
    function createTextFieldObject (textField: TextFieldObject): TextFieldObject
    function createToggleFieldObject (toggleField: ToggleFieldObject): ToggleFieldObject 
    function createPickerFieldObject (pickerField: PickerFieldObject): PickerFieldObject 
    function createComboFieldObject (comboField: ComboFieldObject): ComboFieldObject 
}
