interface RequestHeadersAny {
    [header: string]: string
}

interface RequestHeadersDefined {
    'user-agent'?: string
    'content-type'?: string
    'content-length'?: string
    'authorization'?: string
    'accept-encoding'?: string
    'referer'?: string
}

export type RequestHeaders = RequestHeadersAny & RequestHeadersDefined