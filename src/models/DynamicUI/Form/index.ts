import { Section } from '../Section'

export interface Form {
    sections: () => Promise<Section[]>
    onSubmit: () => void
    validate: () => boolean
}

declare global {
    function createForm(info: Form): Form
}