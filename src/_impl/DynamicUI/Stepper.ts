import { Stepper } from ".."

let _global = global as any

_global.createStepper = function(info: Stepper): Stepper {
    return info
}