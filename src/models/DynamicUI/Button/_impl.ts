import { Button } from "."
import { FormRow } from "../FormRow"

let _global = global as any

_global.createButton = function(info: Button): Button {
    return info
}