import { FormRowTyped } from "../FormRow"

export interface Header extends FormRowTyped<void> {
    title: string
    subtitle: string
    imageUrl: string
}
declare global {
    function createHeader(info: Header): Header
}