import { Source } from ".";
import { Manga, Chapter, ChapterDetails, SearchRequest, PagedResults, MangaTile, LanguageCode, Tag, MangaStatus, HomeSection } from "../models";

export abstract class Madara extends Source {

    /**
     * The base URL of the website. Eg. https://webtoon.xyz
     */
    abstract baseUrl: string

    /**
     * The language code which this source supports.
     */
    abstract languageCode: LanguageCode

    /**
     * The path that precedes a manga page not including the base URL.
     * Eg. for https://www.webtoon.xyz/read/limit-breaker/ it would be 'read'.
     * Used in all functions.
     */
    sourceTraversalPathName: string = 'manga'

    /**
     * By default, the homepage of a Madara is not its true homepage.
     * Accessing the site directory and sorting by the latest title allows
     * functions to step through the multiple pages easier, without a lot of custom
     * logic for each source.
     *
     * This variable holds the latter half of the website path which is required to reach the
     * directory page.
     * Eg. 'webtoons' for https://www.webtoon.xyz/webtoons/?m_orderby=latest
     */
    homePage: string = 'manga'

    /**
     * Some Madara sources have a different selector which is required in order to parse
     * out the popular manga. This defaults to the most common selector
     * but can be overridden by other sources which need it.
     */
    popularMangaSelector: string = "div.page-item-detail"

    /**
     * Much like {@link popularMangaSelector} this will default to the most used CheerioJS
     * selector to extract URLs from popular manga. This is available to be overridden.
     */
    popularMangaUrlSelector: string = "div.post-title a"


    parseDate(dateString: string): Date {
        // Primarily we see dates for the format: "1 day ago" or "16 Apr 2020"
        let dateStringModified = dateString.replace('day', 'days').replace('month', 'months').replace('hour', 'hours')
        return new Date(this.convertTime(dateStringModified))
    }



    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}`,
            method: 'GET'
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)

        let numericId = $('a.wp-manga-action-button').attr('data-post')
        let title = $('div.post-title h1').first().text().replace(/NEW/, '').replace('\\n', '').trim()
        let author = $('div.author-content').first().text().replace("\\n", '').trim()
        let artist = $('div.artist-content').first().text().replace("\\n", '').trim()
        let summary = $('p', $('div.description-summary')).text()
        let image = $('div.summary_image img').first().attr('data-src') ?? ''
        let rating = $('span.total_votes').text().replace('Your Rating', '')
        let isOngoing = $('div.summary-content').text().toLowerCase().trim() == "ongoing"
        let genres: Tag[] = []

        for(let obj of $('div.genres-content a').toArray()) {
            let genre = $(obj).text()
            genres.push(createTag({label: genre, id: genre}))
        }

        // If we cannot parse out the data-id for this title, we cannot complete subsequent requests
        if(!numericId) {
            throw(`Could not parse out the data-id for ${mangaId} - This method might need overridden in the implementing source`)
        }

        return createManga({
            id: numericId,
            titles: [title],
            image: image,
            author: author,
            artist: artist,
            desc: summary,
            status: isOngoing ? MangaStatus.ONGOING : MangaStatus.COMPLETED,
            rating: Number(rating)
        })
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${this.baseUrl}/wp-admin/admin-ajax.php`,
            method: 'POST',
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "referer": this.baseUrl
            },
            data: `action=manga_get_chapters&manga=${mangaId}`
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)
        let chapters: Chapter[] = []

        // Capture the manga title, as this differs from the ID which this function is fed
        let realTitle = $('a', $('li.wp-manga-chapter  ').first()).attr('href')?.replace(`${this.baseUrl}/${this.sourceTraversalPathName}/`, '').replace(/\/chapter.*/, '')

        if(!realTitle) {
            throw(`Failed to parse the human-readable title for ${mangaId}`)
        }

        // For each available chapter..
        for(let obj of $('li.wp-manga-chapter  ').toArray()) {
            let id = $('a', $(obj)).first().attr('href')?.replace(`${this.baseUrl}/${this.sourceTraversalPathName}/${realTitle}/`, '').replace('/', '')
            let chapNum = Number($('a', $(obj)).first().text().replace(/\D/g, ''))
            let releaseDate = $('i', $(obj)).text()

            if(!id) {
                throw(`Could not parse out ID when getting chapters for ${mangaId}`)
            }

            chapters.push({
                id: id,
                mangaId: realTitle,
                langCode: this.languageCode,
                chapNum: chapNum,
                time: this.parseDate(releaseDate)
            })
        }

        return chapters
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.sourceTraversalPathName}/${mangaId}/${chapterId}`,
            method: 'GET',
            cookies: [createCookie({name: 'wpmanga-adault', value: "1", domain: this.baseUrl})]
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)

        let pages: string[] = []

        for(let obj of $('div.page-break').toArray()) {
            let page = $('img', $(obj)).attr('data-src')

            if(!page) {
                throw(`Could not parse page for ${mangaId}/${chapterId}`)
            }

            pages.push(page.replace(/[\t|\n]/g, ''))
        }

        return createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
            longStrip: false
        })

    }

    /**
     * Different Madara sources might have a slightly different selector which is required to parse out
     * each manga object while on a search result page. This is the selector
     * which is looped over. This may be overridden if required.
     */
    searchMangaSelector: string = "div.c-tabs-item__content"

    async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        // If we're supplied a page that we should be on, set our internal reference to that page. Otherwise, we start from page 0.
        let page = metadata.page ?? 0
        const request = createRequestObject({
            url: `${this.baseUrl}/page/${page}?s=${query.title}&post_type=wp-manga`,
            method: 'GET',
            cookies: [createCookie({name: 'wpmanga-adault', value: "1", domain: this.baseUrl})]
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)
        let results: MangaTile[] = []

        for(let obj of $(this.searchMangaSelector).toArray()) {
            let id = $('a', $(obj)).attr('href')?.replace(`${this.baseUrl}/${this.sourceTraversalPathName}/`, '').replace('/', '')
            let title = createIconText({text: $('a', $(obj)).attr('title') ?? ''})
            let image = $('img', $(obj)).attr('data-src')

            if(!id || !title.text || !image) {
                // Something went wrong with our parsing, return a detailed error
                throw(`Failed to parse searchResult for ${this.baseUrl} using ${this.searchMangaSelector} as a loop selector`)
            }

            results.push(createMangaTile({
                id: id,
                title: title,
                image: image
            }))
        }

        // Check to see whether we need to navigate to the next page or not
        if($('div.wp-pagenavi')) {
            // There ARE multiple pages available, now we must check if we've reached the last or not
            let pageContext = $('span.pages').text().match(/(\d)/g)
            
            if(!pageContext || !pageContext[0] || !pageContext[1]) {
                throw(`Failed to parse whether this search has more pages or not. This source may need to have it's searchRequest method overridden`)
            }

            // Because we used the \d regex, we can safely cast each capture to a numeric value
            if(Number(pageContext[1]) != Number(pageContext[2])) {
                metadata.page = page + 1
            }
            else {
                metadata.page = undefined
            }
        }

        return createPagedResults({
            results: results,
            metadata: metadata.page !== undefined ? metadata : undefined
        })
    }

    /**
     * It's hard to capture a default logic for homepages. So for madara sources,
     * instead we've provided a homesection reader for the base_url/webtoons/ endpoint.
     * This supports having paged views in almost all cases.
     * @param sectionCallback 
     */
    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> { 
        let section: HomeSection = createHomeSection({id: "latest", title: "Latest Titles"})
        sectionCallback(section)

        // Parse all of the available data
        const request = createRequestObject({
            url: `${this.baseUrl}/${this.homePage}/?m_orderby=latest`,
            method: 'GET',
            cookies: [createCookie({name: 'wpmanga-adault', value: "1", domain: this.baseUrl})]
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)
        let items: MangaTile[] = []

        for(let obj of $('div.manga').toArray()) {
            let image = $('img', $(obj)).attr('data-src')
            let title = $('a', $('h3.h5', $(obj))).text()
            let id = $('a', $('h3.h5', $(obj))).attr('href')?.replace(`${this.baseUrl}/${this.sourceTraversalPathName}/`, '').replace('/', '')

            if(!id || !title || !image) {
                throw(`Failed to parse homepage sections for ${this.baseUrl}/${this.sourceTraversalPathName}/`)
            }

            items.push(createMangaTile({
                id: id,
                title: createIconText({text: title}),
                image: image
            }))            
        }

        section.items = items
        sectionCallback(section)
     }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
        // We only have one homepage section ID, so we don't need to worry about handling that any
        let page = metadata.page ?? 0   // Default to page 0

        const request = createRequestObject({
            url: `${this.baseUrl}/${this.homePage}/page/${page}/?m_orderby=latest`,
            method: 'GET',
            cookies: [createCookie({name: 'wpmanga-adault', value: "1", domain: this.baseUrl})]
        })

        let data = await this.requestManager.schedule(request, 1)
        let $ = this.cheerio.load(data.data)
        let items: MangaTile[] = []

        for(let obj of $('div.manga').toArray()) {
            let image = $('img', $(obj)).attr('data-src')
            let title = $('a', $('h3.h5', $(obj))).text()
            let id = $('a', $('h3.h5', $(obj))).attr('href')?.replace(`${this.baseUrl}/${this.sourceTraversalPathName}/`, '').replace('/', '')

            if(!id || !title || !image) {
                throw(`Failed to parse homepage sections for ${this.baseUrl}/${this.sourceTraversalPathName}`)
            }

            items.push(createMangaTile({
                id: id,
                title: createIconText({text: title}),
                image: image
            }))            
        }

        // Set up to go to the next page. If we are on the last page, remove the logic.
        metadata.page = page + 1
        if(!$('a.last')) {
            metadata = undefined
        }

        return createPagedResults({
            results: items,
            metadata: metadata
        })
     }
}