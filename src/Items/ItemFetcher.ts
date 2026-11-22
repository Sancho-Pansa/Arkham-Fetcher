import { getArticleWikitextById } from "../FandomFetcher/ArkhamFandomFetcher";

export default async function getItemsJson() {
  const itemList = getItemsList();
  return itemList;
}

async function getItemsList() {
  const PAGE_ID = 1374;
  const SECTION_INDEX = "1";
  const wikitext = await getArticleWikitextById(PAGE_ID, { section: SECTION_INDEX });
  const firstColumnRegex = /\|-\n\| ?\[\[(.*?)\]\]/g;
  const list = Array.from(wikitext.matchAll(firstColumnRegex), (v) => v[1]);
  return list
}