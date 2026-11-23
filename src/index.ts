import getInvestigatorsJson from "./investigators/InvestigatorFetcher";
import fs from "node:fs/promises";
import getItemsJson from "./Items/ItemFetcher";
import CommonItem from "./Items/CommonItem";
import { en2ru, fandom2code } from "./Dictionary";

const data: Record<string, Object[]> = {
  "ужас аркхэма": [],
  "ужас кингспорта": [],
  "ужас данвича": [],
  "ужас иннсмута": [],
  "черная коза чащоб": [],
  "проклятие темного фараона (переиздание)": [],
  "король в желтом": [],
  "затаившийся у порога": []
}

function main() {
  const mode = process.argv[2];
  switch (mode) {
    case "investigators":
      writeInvestigatorsToFile()
      break;
    case "common":
      writeCommonItemsToFile()
      break;
    default:
      console.error("Usage: node index.ts <mode>;\n\tmode: investigators, common");
      process.exit(1);
  }
}

function writeInvestigatorsToFile() {
  getInvestigatorsJson().then((json) => {
    for (let investigator of json) {
      const expansion = investigator.expansion.toLocaleLowerCase();
      if (data[expansion]) {
        data[expansion].push(investigator)
      }
    }
  }).then(() => {
    for (let d of Object.keys(en2ru)) {
      if (data[d].length > 0) {
        writeFile(data[d], `investigator_${en2ru[d]}`)
      }
    }
  });

}

function writeCommonItemsToFile() {
  getItemsJson().then((items) => {
    const allItems: Record<string, CommonItem[]> = {};
    for (let x of Object.keys(en2ru)) {
      allItems[x] = []
    }
    allItems.unknownExpansion = [];

    for (let item of items) {
      let expansion = fandom2code[item.expansion] ?? "unknown";

      if (en2ru[expansion]) {
        allItems[expansion].push(item);
      } else {
        allItems.unknownExpansion.push(item);
      }
    }
    return allItems;
  }).then((allItems) => {
    for (const [ key, value ] of Object.entries(allItems)) {
      if (value.length > 0) {
        writeFile(value, `items_${key}`)
      }
    }
  });
}

function writeFile(json: Object, filename: string) {
  fs.mkdir("./out", { recursive: true });
  fs.writeFile(`./out/${filename}.json`, JSON.stringify(json, null, 2), { encoding: "utf-8" });
}


main();