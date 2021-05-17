import { FormRowTyped } from "../FormRow"

export interface Button extends FormRowTyped<void> {
    label: string
    onTap: () => void
}

declare global {
  function createButton(info: Button): Button
}