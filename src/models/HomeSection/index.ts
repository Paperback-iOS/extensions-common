import { Request } from '../RequestObject'
import { MangaTile } from '../MangaTile'

export interface HomeSection {
  /**
   * An internal identifier of this HomeSection
   */
  id: string

  /**
   * The title of this section. 
   * Common examples of HomeSection titles would be 'Latest Manga', 'Updated Manga',
   * 'Hot Manga', etc.
   */
  title: string

  /**
   * A list of {@link MangaTile} objects which should be shown under this section
   */
  items?: MangaTile[]

  //TODO: Do I have this right? 
  /**
   * Should you be able to scroll, and view more manga on this section? 
   * This method, when true, triggers the {@link Source.getViewMoreRequest} method
   * when the user tries to scroll further on the HomePage section. This usually means 
   * that it will traverse to another page, and render more information
   */
  view_more?: any
}

declare global {
  function createHomeSection(section: HomeSection): HomeSection
}
