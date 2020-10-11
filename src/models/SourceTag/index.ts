/**
 * The {@link SourceTags} interface is an optional metadata interface which the Website uses to 
 * render pretty HTML elements relating to your source.
 * The color of the tag is defined by the {@link TagType} enumeration
 */
export interface SourceTag {
    text: string
    type: TagType
}

/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
export enum TagType {
    BLUE = 'default',
    GREEN = 'success',
    GREY = 'info',
    YELLOW = 'warning',
    RED = 'danger'
}