import { Tag } from ".."

/**
 * The {@link SearchRequest} interface is a list of optional queries, which
 * can be packed together into a search request.
 * Everything is optional, allowing users flexibility to make a search however they
 * desire. As a Source developer, you should ensure that as many of these fields are handled
 * as fine searching is an important user feature.
 */
export interface SearchRequest {
  /**
   * The title of the search request. This usually is the plaintext query you are
   * making as a user
   */
  title?: string

  includedTags?: Tag[]
  excludedTags?: Tag[]

  includeOperator?: SearchOperator
  excludeOperator?: SearchOperator

  /**
   * This is basically anything other than tags that the user enters such as:
   * author: ShindoL author: Miyazuki
   * where `author` would be the key and `ShindoL`, `Myazuki` would be the values. 
   */
  parameters: Record<string, string[]>
}

export enum SearchOperator {
  AND = 'AND', OR = 'OR'
}