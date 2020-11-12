// Import the global wrapper for all the models
import './models/impl_export'

import cheerio from 'cheerio'
import { Source } from './base/Source'

import { Manga } from './models/Manga'
import { Chapter } from './models/Chapter'
import { ChapterDetails } from './models/ChapterDetails'
import { SearchRequest } from './models/SearchRequest'
import { Request } from './models/RequestObject'
import { MangaTile } from './models/MangaTile'
import { MangaUpdates } from '.'

// import axios from 'axios'  <- use this when you've fixed the typings
const axios = require('axios')

export class APIWrapper {

    // WIP
    /* 
     * Implement a common method that takes in a Request and performs it automatically
     *
    private async performRequest(request: Request): Promise<string> {

    }
    */

    /**
     * Retrieves all relevant metadata from a source about particular manga
     *
     * @param source
     * @param ids
     */
    async getMangaDetails(source: Source, ids: string[]): Promise<Manga[]> {
        let requests = source.getMangaDetailsRequest(ids)
        let manga: Manga[] = []
        for (let request of requests) {
            let headers: any = request.headers == undefined ? {} : request.headers
            headers['Cookie'] = this.formatCookie(request)
            headers['User-Agent'] = 'Paperback-iOS'

            try {
                var response = await axios.request({
                    url: `${request.url}${request.param ?? ''}`,
                    method: request.method,
                    headers: headers,
                    data: request.data,
                    timeout: request.timeout || 0
                })
            } catch (e) {
                return []
            }

            manga.push(...source.getMangaDetails(response.data, request.metadata))
        }

        return manga
    }

    /**
     * Retrieves all the chapters for a particular manga
     *
     * @param source
     * @param mangaId
     */
    async getChapters(source: Source, mangaId: string): Promise<Chapter[]> {
        let request = source.getChaptersRequest(mangaId)
        let headers: any = request.headers == undefined ? {} : request.headers
        headers['Cookie'] = this.formatCookie(request)
        headers['User-Agent'] = 'Paperback-iOS'

        try {
            var data = await axios.request({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: request.data,
                timeout: request.timeout || 0
            })

            let chapters: Chapter[] = source.getChapters(data.data, request.metadata)
            return chapters
        } catch (e) {
            return []
        }
    }

    /**
     * Retrieves the images for a particular chapter of a manga
     *
     * @param source
     * @param mangaId
     * @param chId
     */
    async getChapterDetails(source: Source, mangaId: string, chId: string): Promise<ChapterDetails> {
        let request = source.getChapterDetailsRequest(mangaId, chId)
        let metadata = request.metadata
        let headers: any = request.headers == undefined ? {} : request.headers
        headers['Cookie'] = this.formatCookie(request)
        headers['User-Agent'] = 'Paperback-iOS'

        try {
            var data = await axios.request({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: request.data,
                timeout: request.timeout || 0
            })
        } catch (e) {
            throw "error";
        }

        let response = source.getChapterDetails(data.data, metadata)
        /*let details: ChapterDetails = response.details

        // there needs to be a way to handle sites that only show one page per link
        while (response.nextPage && metadata.page) {
            metadata.page++
            try {
                data = await axios.request({
                    url: `${request.url}${metadata.page}`,
                    method: request.method,
                    headers: headers,
                    data: request.data,
                    timeout: request.timeout || 0
                })
            }
            catch (e) {
                return details
            }

            response = source.getChapterDetails(data.data, metadata)
            details.pages.push(response.details.pages[0])
        }*/

        return response
    }

    /**
     * This would take in all the ids that the user is reading
     * then determines whether an update has come out since
     *
     * @param ids
     * @param referenceTime will only get manga up to this time
     * @returns List of the ids of the manga that were recently updated
     */

    // TODO: Update method to support new changes
    async filterUpdatedManga(source: Source, ids: string[], referenceTime: Date): Promise<MangaUpdates> {
        let currentPage = 1
        let hasResults = true
        let request = source.filterUpdatedMangaRequest(ids, referenceTime)
        if (request == null) return Promise.resolve(createMangaUpdates({ ids: [] }))
        let url = request.url
        let headers: any = request.headers == undefined ? {} : request.headers
        headers['Cookie'] = this.formatCookie(request)
        headers['User-Agent'] = 'Paperback-iOS'

        let retries = 0
        do {
            var data = await this.makeFilterRequest(request)
            if (data.code || data.code == 'ECONNABORTED') retries++
            else if (!data.data) {
                return createMangaUpdates({ ids: [] })
            }
        } while (data.code && retries < 5)

        let manga: string[] = []
        while (hasResults && data.data) {
            let results: MangaUpdates | null = source.filterUpdatedManga(data.data, request.metadata)

            if (results === null) {
                return createMangaUpdates({ ids: manga })
            }

            manga = manga.concat(results.ids)
            if (results.nextPage) {
                currentPage++
                let retries = 0
                do {

                    // Create a request object for the next page
                    var nextRequest = createRequestObject({
                        url: `${results.nextPage.url}`,
                        method: results.nextPage.method,
                        metadata: results.nextPage.metadata,
                        headers: results.nextPage.headers,
                        data: results.nextPage.data,
                        param: results.nextPage.param,
                        cookies: results.nextPage.cookies,
                        incognito: results.nextPage.incognito
                    })

                    data = await this.makeFilterRequest(nextRequest)
                    if (data.code || data.code == 'ECONNABORTED') retries++
                    else if (!data.data) {
                        createMangaUpdates({ ids: manga })
                    }
                } while (data.code && retries < 5)
            } else {
                hasResults = false
            }
        }

        return createMangaUpdates({ ids: manga })
    }

    // In the case that a source takes too long (LOOKING AT YOU MANGASEE)
    // we will retry after a 4 second timeout. During testings, some requests would take up to 30 s for no reason
    // this brings that edge case way down while still getting data
    // NOTE: This method has been replaced with the version below, since I have no friggin idea what Dkzver did this 
    // weird post logic for. A more simple version has been supplied in the new version, since page number isn't a thing anymore

    // private async makeFilterRequest(baseUrl: string, request: Request, headers: Record<string, string>, currentPage: number): Promise<any> {
    //     let post: boolean = request.method.toLowerCase() == 'post' ? true : false
    //     try {
    //         if (!post) {
    //             request.url = currentPage == 1 ? baseUrl : baseUrl + currentPage
    //         } else {
    //             // axios has a hard time with properly encoding the payload
    //             // this took me too long to find
    //             request.data = request.data.replace(/(.*page=)(\d*)(.*)/g, `$1${currentPage}$3`)
    //         }

    //         var data = await axios.request({
    //             url: `${request.url}`,
    //             method: request.method,
    //             headers: headers,
    //             data: request.data,
    //             timeout: request.timeout || 0
    //         })
    //     } catch (e) {
    //         return e
    //     }
    //     return data
    // }

    private async makeFilterRequest(request: Request): Promise<any> {
        var data = await axios.request({
            url: `${request.url}`,
            method: request.method,
            headers: request.headers,
            data: request.data,
            timeout: request.timeout || 0
        })
        return data
    }

    /**
     * Home page of the application consists of a few discover sections.
     * This will contain featured, newly updated, new manga, etc.
     *
     * @param none
     * @returns {Sections[]} List of sections
     */
    async getHomePageSections(source: Source) {
        let request = source.getHomePageSectionRequest()
        if (request == null) return Promise.resolve([])

        let keys: any = Object.keys(request)
        let configs = []
        let sections: any = []
        for (let key of keys) {
            for (let section of request[key].sections)
                sections.push(section)
            configs.push(request[key].request)
        }

        try {
            var data: any = await Promise.all(configs.map(axios.request))

            // Promise.all retains order
            for (let i = 0; i < data.length; i++) {
                sections = source.getHomePageSections(data[i].data, sections)
            }

            return sections
        } catch (e) {
            return []
        }
    }

    /**
     * Creates a search query for the source
     *
     * @param query
     * @param page
     */
    // TODO: update this to return a promise of PagedResults
    async search(source: Source, query: SearchRequest, page: number): Promise<MangaTile[]> {
        let request = source.searchRequest(query)
        if (request == null) return Promise.resolve([])

        let headers: any = request.headers == undefined ? {} : request.headers
        headers['Cookie'] = this.formatCookie(request)
        headers['User-Agent'] = 'Paperback-iOS'

        try {
            var data = await axios.request({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: request.data,
                timeout: request.timeout || 0
            })

            return source.search(data.data, request.metadata)?.results ?? []
        } catch (e) {
            return []
        }
    }

    async getTags(source: Source) {
        let request = source.getTagsRequest()
        if (request == null) return Promise.resolve([])
        let headers: any = request.headers == undefined ? {} : request.headers
        headers['Cookie'] = this.formatCookie(request)
        headers['User-Agent'] = 'Paperback-iOS'

        try {
            var data = await axios.request({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: request.data,
                timeout: request.timeout || 0
            })

            return source.getTags(data.data) ?? []
        } catch (e) {
            console.log(e)
            return []
        }
    }

    // TODO: update this to return a promise of PagedResults
    async getViewMoreItems(source: Source, key: string, page: number) {
        // let request = source.getViewMoreRequest(key)
        // if (request == null) return Promise.resolve([])
        // let headers: any = request.headers == undefined ? {} : request.headers
        // headers['Cookie'] = this.formatCookie(request)
        // headers['User-Agent'] = 'Paperback-iOS'

        // try {
        //     var data = await axios.request({
        //         url: `${request.url}${request.param ?? ''}`,
        //         method: request.method,
        //         headers: headers,
        //         data: request.data,
        //         timeout: request.timeout || 0
        //     })

        //     return source.getViewMoreItems(data.data, key, request.metadata)?.results
        // } catch (e) {
        //     console.log(e)
        //     return []
        // }
    }

    private formatCookie(info: Request): string {
        let fCookie = ''
        for (let cookie of info.cookies ?? [])
            fCookie += `${cookie.name}=${cookie.value};`
        return fCookie
    }
}