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

const DEFAULT_URL = "https://arkhamhorror.fandom.com/ru/api.php";

export async function getArticleWikitextByName(title: string) {
  const prop = "wikitext";
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  } as Request;

  const searchParams = new URLSearchParams({
    action: "parse",
    format: "json",
    formatversion: "2",
    prop: prop,
    page: title
  });

  const url = new URL(`${DEFAULT_URL}?${searchParams.toString()}`);

  return getArticle(url, requestOptions, prop) as unknown as string;
}

export async function getArticleWikitextById(pageId: number, params?: Record<string, string>): Promise<string> {
  const prop = "wikitext";
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  } as Request;

  const searchParams = new URLSearchParams({
    action: "parse",
    format: "json",
    formatversion: "2",
    prop: prop,
    pageid: pageId.toString()
  });
  if (params) {
    for(const k in params) {
      searchParams.append(k, params[k])
    }
  }

  const url = new URL(`${DEFAULT_URL}?${searchParams.toString()}`);

  return getArticle(url, requestOptions, prop) as unknown as string;
}

export async function getArticleTocDataById(pageId: number): Promise<TocData> {
  const prop = "tocdata";
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  } as Request;

  const searchParams = new URLSearchParams({
    action: "parse",
    format: "json",
    formatversion: "2",
    prop: prop,
    pageid: pageId.toString()
  });

  const url = new URL(`${DEFAULT_URL}?${searchParams.toString()}`);

  return getArticle(url, requestOptions, prop) as unknown as TocData;
}

async function getArticle(url: URL, requestOptions: Request, propField: string): Promise<string | TocData> {
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Error in Fandom Request :: Code: ${response.status} (${response.statusText})`);
  }

  let responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(`Error from MediaWiki API: ${responseJson.error}`)
  }

  if (!responseJson.parse[propField]) {
    throw new Error(`No such field ${propField} in response`);
  }

  let result = responseJson.parse[propField];

  return result;
}