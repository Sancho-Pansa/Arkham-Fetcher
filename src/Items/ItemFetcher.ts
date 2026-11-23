import { getArticleWikitextById, getArticleWikitextByName } from "../FandomFetcher/ArkhamFandomFetcher";
import sanitizeWikitext from "../FandomFetcher/WikiSanitizer";
import Item from "./CommonItem";

export default async function getItemsJson() {
  const promises = (await getItemsList()).map(async ({ item: itemName, expansion }) => {
    const wikipage = await getArticleWikitextByName(itemName);

    return parseWikitext(itemName, expansion, wikipage);
  });
  return Promise.all(promises);
}

async function getItemsList() {
  const PAGE_ID = 1374;
  const SECTION_INDEX = "1";
  const wikitext = await getArticleWikitextById(PAGE_ID, { section: SECTION_INDEX });
  const tableRegex = /\|\s*?\[\[(?<item>.*?)\]\]\n(?<type>.*)\n\|(?<cost>.*)\n\|(.*\{\{(?<expansion>.*)\}\})?\n/g;


  const itemList = Array.from(wikitext.matchAll(tableRegex)).map((m) => {
    const { item, expansion } = m.groups as { item: string, type: string, cost: string, expansion?: string };

    return {
      item,
      expansion: parseExpansion(expansion ?? "")
    };
  });

  return itemList;
}

async function parseWikitext(item: string, expansion: string, wikitext: string) {
  const typeRegex = /^\|ItemType=(.*)$/gm;
  const bonusRegex = /^\|ItemBonus=(.*)$/gm;
  const textRegex = /^\|ItemText=(.*)$/gm;
  const handsRegex = /^\|ItemHands=(.*)$/gm;
  const phaseRegex = /^\|UsePhase=(.*)$/gm;
  const phaseTextRegex = /^\|UsePhaseText=(.*)$/gm;
  const priceRegex = /^\|ItemPrice=(.*)$/gm;
  const taskRegex = /^\|TaskLocation\d=(.*)$/gm;

  const itemType = wikitext.match(typeRegex)?.[1];
  let text = "";
  if (itemType === "Задача") {
    text = Array.from(wikitext.matchAll(taskRegex)).map(m => m[1]).join("\n");
  } else {
    text = sanitizeWikitext(textRegex.exec(wikitext)?.[1] ?? "");
  }

  return new Item(
    item,
    expansion,
    Number(priceRegex.exec(wikitext)?.[1] ?? 0),
    Number(handsRegex.exec(wikitext)?.[1] ?? 0),
    {
      type: itemType,
      passive: sanitizeWikitext(bonusRegex.exec(wikitext)?.[1] ?? ""),
      text: text,
      active: {
        phase: sanitizeWikitext(phaseRegex.exec(wikitext)?.[1] ?? ""),
        text: sanitizeWikitext(phaseTextRegex.exec(wikitext)?.[1] ?? "")
      },
    }
  )
}

/**
 * На вход берет фрагмент таблицы предметов, где указывается дополнение.
 * Это либо "%имя дополнения% icon", либо пустота
 * @param expansion
 */
function parseExpansion(expansion: string) {
  if (expansion === "") {
    return "vanilla";
  }
  const regex = /(.*) icon/;

  return (expansion.match(regex)?.[1] ?? "vanilla").toLocaleLowerCase();
}