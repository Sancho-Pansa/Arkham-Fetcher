import { beforeAll, describe, expect, test } from "vitest";
import getItemsJson from "./ItemFetcher";
import CommonItem from "./CommonItem";

describe("Testing received data", () => {
  let items: CommonItem[];

  beforeAll(async () => {
    items = await getItemsJson();
  }, 10000);

  test("Should return array of CommonItem objects", () => {
    expect(items.length).toBeGreaterThan(0);
  });

  test("Should have specific item in it", () => {
    const diary = items.find((item) => item.name === "Старый дневник");
    expect(diary).toBeDefined();
  });

  test("Should handle Task item type", () => {
    const item = items.find((item) => item.name === "Газетный репортаж");
    expect(item).toBeDefined();
    expect(item?.text ?? "").toMatch(/.*?\n.*\n.*/m);
  });
});