import { FormRowTyped } from ".."

export interface WebViewButton extends FormRowTyped<string | undefined> {
    label: string
    completionHandler: () => void
}