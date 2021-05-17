export interface FormRow {
    id: string
    value: any
}

export interface FormRowTyped<T> extends FormRow {
    value: T
}