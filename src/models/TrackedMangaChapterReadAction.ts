
export interface TrackedMangaChapterReadAction {
  mangaId: string
  sourceMangaId: string
  sourceChapterId: string
  sourceId: string
  chapterNumber: number
  volumeNumber: number
  readTime: Date
}