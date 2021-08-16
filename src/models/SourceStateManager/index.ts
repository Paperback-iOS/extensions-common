// Any dependent objects? Probably not, json objects from this point on.
export interface SourceStateManagerInfo {

}

export interface SourceStateManager extends SourceStateManagerInfo {
    store: (key: string, value: unknown) => Promise<void>
    retrieve: (key: string) => Promise<unknown | null>

    keychain: SourceKeychain
}

export interface SourceKeychain {
    store: (key: string, value: unknown) => Promise<void>
    retrieve: (key: string) => Promise<unknown | undefined>
}

declare global {
    function createSourceStateManager(info:SourceStateManagerInfo): SourceStateManager
}