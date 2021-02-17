import { SourceStateManagerInfo, SourceStateManager } from "."

const _global = global as any

_global.createSourceStateManager = function (info: SourceStateManagerInfo): SourceStateManager {
    return {
        ...info,
        store: function (key: string, value: string) {
            // Fill this in so the test classes don't commit sudoku
            virtualStateStore.key = value
        },
        retrieve: function (key: string) {
            return virtualStateStore.key ?? ""
        }
    }
}

var virtualStateStore: any = {}