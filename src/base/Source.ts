/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */

import {
  HomeSection,
  SearchRequest,
  Manga,
  Request,
  Chapter,
  ChapterDetails,
  TagSection,
  MangaUpdates,
  RequestManager,
  PagedResults,
  Cookie,
  RequestHeaders,
  UserForm,
  SourceMenu
} from ".."

export abstract class Source {
  /**
   * Manages the ratelimits and the number of requests that can be done per second
   * This is also used to fetch pages when a chapter is downloading
   */
  abstract readonly requestManager: RequestManager

  constructor(public cheerio: CheerioAPI) {}

  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link Manga} object
   * @param mangaId The ID which this function is expected to grab data for
   */
  abstract getMangaDetails(mangaId: string): Promise<Manga>

  /**
   * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
   * to grab and populate a {@link Chapter} array.
   * @param mangaId The ID which this function is expected to grab data for
   */
  abstract getChapters(mangaId: string): Promise<Chapter[]>

  /**
  * Given a mangaID, this function should use a {@link Request} object's {@link Request.perform} method
  * to grab and populate a {@link ChapterDetails} object
  * @param mangaId The ID which this function is expected to grab data for
  */
  abstract getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails>

  /**
   * Given a search request, this function should scan through the website's search page and 
   * return relevent {@link MangaTile} objects to the given search parameters.
   * This function is ONLY expected to return the first page of search results.
   * If there is more than one page of search results, the {@link PagedResults.metadata}
   * variable should be filled out with some kind of information pointing to the next page of the search.
   * @param query A app-filled query which the search request should request from the website.
   * @param metadata A persistant metadata parameter which can be filled out with any data required between search page sections
   */
  abstract searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults>

  // <-----------        OPTIONAL METHODS        -----------> //
  /**
   * @deprecated Do not use this methods, register an interceptor with RequestManager instead
   */
  globalRequestHeaders?(): RequestHeaders

  /**
   * @deprecated Do not use this method, register an interceptor with RequestManager instead
   */
  globalRequestCookies?(): Cookie[]

  getSourceMenu?(): Promise<SourceMenu>

  /**
   * A stateful source may require user input. 
   * By supplying this value to the Source, the app will render your form to the user
   * in the application settings.
   */
  getSourceMenuItemForm?(itemId: string): Promise<UserForm>
  getSourceMenuItemLink?(itemId: string): Promise<URL>

  submitSourceMenuItemForm?(id: string, form: any): Promise<void>

  /**
   * When the Advanced Search is rendered to the user, this skeleton defines what
   * fields which will show up to the user, and returned back to the source
   * when the request is made.
   */
  getAdvancedSearchForm?(): Promise<UserForm>

  /**
   * (OPTIONAL METHOD) Given a manga ID, return a URL which Safari can open in a browser to display.
   * @param mangaId 
   */
  getMangaShareUrl?(mangaId: string): string

  /**
   * If a source is secured by Cloudflare, this method should be filled out.
   * By returning a request to the website, this source will attempt to create a session
   * so that the source can load correctly.
   * Usually the {@link Request} url can simply be the base URL to the source.
   */
  getCloudflareBypassRequest?(): Request

  /**
   * (OPTIONAL METHOD) A function which communicates with a given source, and returns a list of all possible tags which the source supports.
   * These tags are generic and depend on the source. They could be genres such as 'Isekai, Action, Drama', or they can be 
   * listings such as 'Completed, Ongoing'
   * These tags must be tags which can be used in the {@link searchRequest} function to augment the searching capability of the application
   */
  getTags?(): Promise<TagSection[]>

  /**
   * (OPTIONAL METHOD) A function which should scan through the latest updates section of a website, and report back with a list of IDs which have been
   * updated BEFORE the supplied timeframe. 
   * This function may have to scan through multiple pages in order to discover the full list of updated manga. 
   * Because of this, each batch of IDs should be returned with the mangaUpdatesFoundCallback. The IDs which have been reported for
   * one page, should not be reported again on another page, unless the relevent ID has been detected again. You do not want to persist
   * this internal list between {@link Request} calls
   * @param mangaUpdatesFoundCallback A callback which is used to report a list of manga IDs back to the API
   * @param time This function should find all manga which has been updated between the current time, and this parameter's reported time.
   *             After this time has been passed, the system should stop parsing and return 
   */
  filterUpdatedManga?(mangaUpdatesFoundCallback: (updates: MangaUpdates) => void, time: Date, ids: string[]): Promise<void>

  /**
   * (OPTIONAL METHOD) A function which should readonly allf the available homepage sections for a given source, and return a {@link HomeSection} object.
   * The sectionCallback is to be used for each given section on the website. This may include a 'Latest Updates' section, or a 'Hot Manga' section.
   * It is recommended that before anything else in your source, you first use this sectionCallback and send it {@link HomeSection} objects
   * which are blank, and have not had any requests done on them just yet. This way, you provide the App with the sections to render on screen,
   * which then will be populated with each additional sectionCallback method called. This is optional, but recommended.
   * @param sectionCallback A callback which is run for each independant HomeSection.  
   */
  getHomePageSections?(sectionCallback: (section: HomeSection) => void): Promise<void>

  /**
   * (OPTIONAL METHOD) This function will take a given homepageSectionId and metadata value, and with this information, should return
   * all of the manga tiles supplied for the given state of parameters. Most commonly, the metadata value will contain some sort of page information,
   * and this request will target the given page. (Incrementing the page in the response so that the next call will return relevent data)
   * @param homepageSectionId The given ID to the homepage defined in {@link getHomePageSections} which this method is to readonly moreata about 
   * @param metadata This is a metadata parameter which is filled our in the {@link getHomePageSections}'s return
   * function. Afterwards, if the metadata value returned in the {@link PagedResults} has been modified, the modified version
   * will be supplied to this function instead of the origional {@link getHomePageSections}'s version. 
   * This is useful for keeping track of which page a user is on, pagnating to other pages as ViewMore is called multiple times.
   */
  getViewMoreItems?(homepageSectionId: string, metadata: any): Promise<PagedResults>

  /**
   * (OPTIONAL METHOD) This function is to return the entire library of a manga website, page by page.
   * If there is an additional page which needs to be called, the {@link PagedResults} value should have it's metadata filled out
   * with information needed to continue pulling information from this website. 
   * Note that if the metadata value of {@link PagedResults} is undefined, this method will not continue to run when the user
   * attempts to readonly morenformation
   * @param metadata Identifying information as to what the source needs to call in order to readonly theext batch of data
   * of the directory. Usually this is a page counter.
   */
  getWebsiteMangaDirectory?(metadata: any): Promise<PagedResults>
}

// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
export function convertTime(timeAgo: string): Date {
  let time: Date
  let trimmed: number = Number((/\d*/.exec(timeAgo) ?? [])[0])
  trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed
  if (timeAgo.includes('minutes')) {
    time = new Date(Date.now() - trimmed * 60000)
  }
  else if (timeAgo.includes('hours')) {
    time = new Date(Date.now() - trimmed * 3600000)
  }
  else if (timeAgo.includes('days')) {
    time = new Date(Date.now() - trimmed * 86400000)
  }
  else if (timeAgo.includes('year') || timeAgo.includes('years')) {
    time = new Date(Date.now() - trimmed * 31556952000)
  }
  else {
    time = new Date(Date.now())
  }

  return time
}

/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj 
 */
export function urlEncodeObject(obj: { [x: string]: any }): any {
  let ret: any = {}
  for (const entry of Object.entries(obj)) {
      ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1])
  }
  return ret
}