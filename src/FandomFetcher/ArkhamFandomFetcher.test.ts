import { expect, describe, test } from "vitest";
import { getArticleWikitextByName, getArticleTocDataById, getArticleWikitextById } from "./ArkhamFandomFetcher";


describe("Get article wikitext from Arkham Fandom", () => {
  test("Should return article in wikitext", async () => {
    const wikitext = await getArticleWikitextByName("Сыщики");
    expect(wikitext).toBeDefined()
    expect(wikitext.length).toBeGreaterThan(20);
  });
  test("Should return specific section from the article", async () => {
    const wikitext = await getArticleWikitextById(1361, { section: "7" });
    expect(wikitext.substring(0, 18)).toBe("==Список сыщиков==");
  });
});

describe("Get TOC from article", () => {
  test("Show get name of Section containing table", async () => {
    const PAGE_ID = 1361;
    const SECTION_INDEX = "7";
    const investigatorArticleToc = await getArticleTocDataById(PAGE_ID);
    const articleSections = investigatorArticleToc.sections;
    const section = articleSections.find(s => s.index === SECTION_INDEX)
    expect(section?.line).toBe("Список сыщиков");
  })
});