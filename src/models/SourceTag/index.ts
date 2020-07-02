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
 * Info is blue, success is green, warning is yellow and danger is red.
 */
export enum TagType {
    WARNING = 'warning',
    INFO = 'info',
    SUCCESS = 'success',
    DANGER = 'danger'
}