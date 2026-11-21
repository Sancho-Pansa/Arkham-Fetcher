export interface MediaWikiTocDataResponse {
  parse: MediaWikiTocDataResponseParse
}

export interface MediaWikiTocDataResponseParse {
  title: string
  pageid: number
  tocdata: TocData
  showtoc: boolean
}

export interface TocData {
  sections: ArticleSection[]
  extensionData: any[]
}

export interface ArticleSection {
  tocLevel: number
  hLevel: number
  line: string
  number: string
  index: string
  fromTitle: string
  codepointOffset: number
  anchor: string
}
