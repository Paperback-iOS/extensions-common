export interface UserForm {
    formElements: FormObject[]
}

interface FormObject {
    id: string
    label: string
}

interface FormValueObject<T> extends FormObject {
    value: T
}

export interface TextFieldObject extends FormValueObject<string> {
    placeholderText: string
}

export interface ToggleFieldObject extends FormValueObject<boolean> {
    // Blank - App consumes this for typing data
}

export interface PickerFieldObject extends FormValueObject<string> {
    values: string[]
}

export interface ComboFieldObject extends FormValueObject<string> {
    values: string[]
}


declare global {
    function createUserForm(userForm: UserForm): UserForm 
    function createTextFieldObject (textField: TextFieldObject): TextFieldObject
    function createToggleFieldObject (toggleField: ToggleFieldObject): ToggleFieldObject 
    function createPickerFieldObject (pickerField: PickerFieldObject): PickerFieldObject 
    function createComboFieldObject (comboField: ComboFieldObject): ComboFieldObject 
}
