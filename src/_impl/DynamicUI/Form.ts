import { Form } from ".."

let _global = global as any

_global.createForm = function(info: Form): Form {
    return info
}