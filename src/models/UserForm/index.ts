export interface UserForm {
    formElements: FormObject[]
}

export interface FormObject {
    id: string
    userReadableTitle: string
    type: FormType
    metadata?: any
    userResponse?: any
}

export enum FormType {
    TEXT_INPUT = "text",
    TOGGLE_INPUT = "toggle",
    PICKER_INPUT = "picker"
}

declare global {
    function createUserForm(userForm: UserForm): UserForm 
    function createFormObject (formObject: FormObject): FormObject 
}
