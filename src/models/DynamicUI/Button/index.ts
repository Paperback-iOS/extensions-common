import { FormRowTyped } from "../FormRow"

export interface Button extends FormRowTyped<string | undefined> {
    label: string
    onTap: () => void
}

declare global {
  function createButton(info: Button): Button
}