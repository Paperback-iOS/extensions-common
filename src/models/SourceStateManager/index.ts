// Any dependent objects? Probably not, json objects from this point on.
export interface SourceStateManagerInfo {

}

export interface SourceStateManager extends SourceStateManagerInfo {
    store: (key: string, value: any) => Promise<void>
    retrieve: (key: string) => Promise<any | null>
}

declare global {
    function createSourceStateManager(info:SourceStateManagerInfo): SourceStateManager
}