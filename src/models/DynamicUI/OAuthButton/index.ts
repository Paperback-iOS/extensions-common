import { FormRowTyped } from "../FormRow"

export interface OAuthButton extends FormRowTyped<string | undefined> {
    label: string

    authorizeEndpoint: String
    clientId: String
    responseType: OAuthResponseType
    redirectUri?: string
    scopes?: string[]

    /// Store this inside the keychain in the state manager
    successHandler: (accessToken: string, refreshToken?: string) => Promise<void>
}

/// No need to make a wrapper for this, you can use it directly
interface OAuthResponseType {
    type: "code" | "pkce" | "token"

    /// Only required for "pkce" and "code" response types
    tokenEndpoint?: string

    /// Only required for "pkce" response type
    pkceCodeLength?: number
}

declare global {
    function createOAuthButton(info: OAuthButton): OAuthButton
}