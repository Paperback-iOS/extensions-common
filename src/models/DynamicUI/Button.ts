import { FormRowTyped } from ".."

export interface Button extends FormRowTyped<string | undefined> {
    label: string
    onTap: () => void
}

declare global {
  function createButton(info: Button): Button
}