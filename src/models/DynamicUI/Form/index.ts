import { Section } from '../Section'

export interface Form {
    sections: () => Section[]
    onSubmit: () => void
    validate: () => boolean
}

declare global {
    function createForm(info: Form): Form
}