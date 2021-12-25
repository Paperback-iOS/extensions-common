import { NavigationButton } from ".."

let _global = global as any

_global.createNavigationButton = function(info: NavigationButton): NavigationButton {
    return info
}