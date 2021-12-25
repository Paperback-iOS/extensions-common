import { FormRow } from "..";

export interface Section {
    id: string
    header?: string
    footer?: string
    rows: () => Promise<FormRow[]>
}

declare global {
    function createSection(section: Section): Section
}