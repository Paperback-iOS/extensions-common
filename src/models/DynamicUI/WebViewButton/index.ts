import { FormRowTyped } from "../FormRow"

export interface WebViewButton extends FormRowTyped<string | undefined> {
    label: string
    completionHandler: () => void
}