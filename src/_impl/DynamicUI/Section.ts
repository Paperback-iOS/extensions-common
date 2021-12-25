import { Section } from ".."

let _global = global as any

_global.createSection = function(info: Section): Section {
    return info
}