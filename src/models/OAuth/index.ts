export interface OAuth {
    accessToken: string
    tokenType: string
    createdAt: number
    expiresIn: number
    refreshToken?: string
}

declare global {
    function createOAuth(oauth: OAuth): OAuth
}