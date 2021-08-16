import { Section } from '../Section'

export interface Form {
    sections: () => Promise<Section[]>
    onSubmit: (values: any) => Promise<void>
    validate: (values: any) => Promise<boolean>
}

declare global {
    function createForm(info: Form): Form
}