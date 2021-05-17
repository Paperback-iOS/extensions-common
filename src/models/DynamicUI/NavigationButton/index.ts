import { FormRowTyped } from "../FormRow"

export interface NavigationButton extends FormRowTyped<string | undefined> {
    label: string
}

declare global {
    function createNavigationButton(info: NavigationButton): NavigationButton
}