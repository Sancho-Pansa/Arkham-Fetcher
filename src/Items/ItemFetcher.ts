import { getArticleWikitextById, getArticleWikitextByName } from "../FandomFetcher/ArkhamFandomFetcher";
import sanitizeWikitext from "../FandomFetcher/WikiSanitizer";
import Item from "./Item";

export default async function getItemsJson() {
  const promises = (await getItemsList()).map(async (itemName) => {
    let wikipage = await getArticleWikitextByName(itemName);
    return parseWikitext(itemName, wikipage);
  });
  return Promise.all(promises);
}

async function getItemsList() {
  const PAGE_ID = 1374;
  const SECTION_INDEX = "1";
  const wikitext = await getArticleWikitextById(PAGE_ID, { section: SECTION_INDEX });
  const firstColumnRegex = /\|-\n\| ?\[\[(.*?)\]\]/g;
  const list = Array.from(wikitext.matchAll(firstColumnRegex), (v) => v[1]);
  return list;
}

async function parseWikitext(item: string, wikitext: string) {
  const expansionRegex = /^\|Edition=(.*)$/gm;
  const typeRegex = /^\|ItemType=(.*)$/gm;
  const bonusRegex = /^\|ItemBonus=(.*)$/gm;
  const textRegex = /^\|ItemText=(.*)$/gm;
  const handsRegex = /^\|ItemHands=(.*)$/gm;
  const phaseRegex = /^\|UsePhase=(.*)$/gm;
  const phaseTextRegex = /^\|UsePhaseText=(.*)$/gm;
  const priceRegex = /^\|ItemPrice=(.*)$/gm;

  return new Item(
    item,
    expansionRegex.exec(wikitext)?.[1] ?? "",
    Number(priceRegex.exec(wikitext)?.[1] ?? 0),
    Number(handsRegex.exec(wikitext)?.[1] ?? 0),
    {
      type: typeRegex.exec(wikitext)?.[1],
      passive: sanitizeWikitext(bonusRegex.exec(wikitext)?.[1] ?? ""),
      text: sanitizeWikitext(textRegex.exec(wikitext)?.[1] ?? ""),
      active: {
        phase: sanitizeWikitext(phaseRegex.exec(wikitext)?.[1] ?? ""),
        text: sanitizeWikitext(phaseTextRegex.exec(wikitext)?.[1] ?? "")
    },
    }
  )
}