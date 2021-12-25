import { InputField } from ".."

let _global = global as any

_global.createInputField = function(info: InputField): InputField {
    return info
}