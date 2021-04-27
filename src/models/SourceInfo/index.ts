import { SourceTag } from ".."

export interface SourceInfo {
    // Returns the version of the source
    // Ensures that the app is using the most up to date version
    /**
     * Required class variable which denotes the current version of the application. 
     * This is what the application uses to determine whether it needs to update it's local
     * version of the source, to a new version on the repository
     */
    readonly version: string

    /**
     * The title of this source, this is what will show up in the application
     * to identify what Manga location is being targeted
     */
    readonly name: string

    /**
     * An INTERNAL reference to an icon which is associated with this source.
     * This Icon should ideally be a matching aspect ratio (a cube)
     * The location of this should be in an includes directory next to your source.
     * For example, the MangaPark link sits at: sources/MangaPark/includes/icon.png
     * This {@link Source.icon} field would then be simply referenced as 'icon.png' and
     * the path will then resolve correctly internally
     */
    readonly icon: string

    /**
     * The author of this source. The string here will be shown off to the public on the application
     * interface, so only write what you're comfortable with showing
     */
    readonly author: string

    /**
     * A brief description of what this source targets. This is additional content displayed to the user when 
     * browsing sources. 
     * What website does it target? What features are working? Etc.
     */
    readonly description: string

    /**
     * A content rating attributed to each source. This can be one of three values, and should be set appropriately.
     * Everyone: This source does not have any sort of adult content available. Each title within is assumed safe for all audiences
     * Mature: This source MAY have mature content inside of it. Even if most content is safe, mature should be selected even if a small subset applies
     * Adult: This source probably has straight up pornography available. 
     * 
     * This rating helps us filter your source to users who have the necessary visibility rules toggled for their profile.
     * Naturally, only 'Everyone' sources will show up for users without an account, or without any mode toggles changed.
     */
    readonly contentRating: ContentRating

    /**
     * A required field which points to the source's front-page.
     * Eg. https://mangadex.org
     * This must be a fully qualified URL
     */
    readonly websiteBaseURL: string

    /**
     * An optional field where the author may put a link to their website
     */
    readonly authorWebsite?: string

    /**
     * An optional field that defines the language of the extension's source
     */
    readonly language?: string

    /**
     * An optional field of source tags: Little bits of metadata which is rendered on the website
     * under your repositories section
     */
    readonly sourceTags?: SourceTag[]

}

/**
 * A content rating to be attributed to each source. 
 */
export enum ContentRating {
    EVERYONE = "EVERYONE",
    MATURE = "MATURE",
    ADULT = "ADULT"
}