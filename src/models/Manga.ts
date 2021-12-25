import { TagSection } from ".."

export interface Manga {
	/**
	 * A list of titles which this Manga is called.
	 * There may be secondary titles, which can be pushed to this variable
	 */
	titles: string[]

	/**
	 * A URL pointing to a thumbnail which can be displayed to present the manga
	 */
	image: string

	/**
	 * The rating which users have given this manga
	 */
	rating?: number

	/**
	 * A status code for this manga. This is likely different each source.
	 * For example, a zero might mean that it is unreleased. A one may mean it is ongoing. etc.
	 */
	status: MangaStatus

	/**
	 * A language code for the Manga, if one is available.
	 * Examples: en is English, jp is Japanese, etc
	 */
	langFlag?: string

	/**
	 * The name of the artist who has worked on this manga
	 */
	artist?: string

	/**
	 * The author which has written this manga
	 */
	author?: string

	/**
	 * If the manga has additional pictures past the title thumbnail, covers may be used
	 * to display other pieces of art.
	 * The contents of this array should be URLs to the images
	 */
	covers?: string[]

	/**
	 * A description of this manga, if available
	 */
	desc?: string

	/**
	 * The number of followers on the source, which follow this manga
	 */
	follows?: number

	/**
	 * A list of {@link TagSection}, tags, which this Manga has
	 */
	tags?: TagSection[]

	/**
	 * How many views has this manga had up to date
	 */
	views?: number

	/**
	 * Is this manga Hentai?
	 */
	hentai?: boolean

	/**
	 * Any manga IDs which are related to this entry.
	 * See {@link Manga.id} for additional information as to what
	 * this should hold
	 */
	relatedIds?: string[]

	/**
	 * The time which this manga has been updated last
	 */
	lastUpdate?: Date
}

export enum MangaStatus {
	ONGOING = 1,
	COMPLETED = 0,
	UNKNOWN = 2,
	ABANDONED = 3,
	HIATUS = 4
}

declare global {
	// @deprecated use `createSourceManga` along with `createMangaInfo`
	function createManga(info: {id: string} & Manga): Manga
	function createMangaInfo(info: Manga): Manga
}