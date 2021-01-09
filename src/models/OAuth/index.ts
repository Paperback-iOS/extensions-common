export interface OAuth {
    access_token: string
    token_type: string
    createdAt: number
    expiresIn: number
    refresh_token?: string
}

declare global {
    function createOAuth(oauth: OAuth): OAuth
}