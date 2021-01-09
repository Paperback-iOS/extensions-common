export interface TrackObject {

    id?: number
    mangaId: number
    syncId: number
    mediaId: number

    /**
     * The ID of the tracked object in Paperback's library.
     * Generally this is only set in the app, and does not need defined or touched
     * by the tracker implementation
     */
    libraryId?: number
    title: string
    lastChapterRead: number
    totalChapters: number
    score: number
    status: number
    tracking_url: string

}