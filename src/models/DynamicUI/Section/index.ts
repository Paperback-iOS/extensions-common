import { FormRow } from "../FormRow"

export interface Section {
    header: string
    footer: string
    rows: () => FormRow[]
}

declare global {
    function createSection(section: Section): Section
}