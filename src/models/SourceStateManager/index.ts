// Any dependent objects? Probably not, json objects from this point on.
export interface SourceStateManagerInfo {

}

export interface SourceStateManager extends SourceStateManagerInfo {
    store: (key: string, value: any) => Promise<void>
    retrieve: (key: string) => Promise<any | null>

    keychain: SourceKeychain
}

export interface SourceKeychain {
    store: (key: string, value: string) => Promise<void>
    retrieve: (key: string) => Promise<any | undefined>
}

declare global {
    function createSourceStateManager(info:SourceStateManagerInfo): SourceStateManager
}