import { describe, expect, test } from "vitest";
import getItemsJson from "./ItemFetcher";

describe("Testing received data", () => {
  test("Should be list of item strings", async () => {
    expect((await getItemsJson()).length).toBeGreaterThan(0);
  })
});