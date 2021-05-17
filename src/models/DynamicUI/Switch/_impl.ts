import { Switch } from "."

let _global = global as any

_global.createSwitch = function(info: Switch): Switch {
    return info
}