import { describe, expect, test } from "vitest";
import getItemsJson from "./ItemFetcher";

describe("Testing received data", () => {
  test("Should return array of Item objects", async () => {
    const result = await getItemsJson();
    expect(result.length).toBeGreaterThan(0);
    console.log(result[1]);
  }, 10000)
});