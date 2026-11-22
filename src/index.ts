import getInvestigatorsJson from "./investigators/InvestigatorFetcher";
import fs from "node:fs/promises";
import Investigator from "./investigators/Investigator";
import getItemsJson from "./Items/ItemFetcher";
import Item from "./Items/Item";

function main() {
  const mode = process.argv[2];
  switch (mode) {
    case "investigators":
      writeInvestigatorsToFile()
      break;
    case "items":
      writeItemsToFile()
      break;
    default:
      console.error("Usage: node index.ts <mode>;\n\tmode: investigators, items");
      process.exit(1);
  }
}

function writeInvestigatorsToFile() {
  getInvestigatorsJson().then((json) => {
    const vanilla: Investigator[] = [];
    const kingsport: Investigator[] = [];
    const dunwich: Investigator[] = [];
    const innsmouth: Investigator[] = [];
    for (let investigator of json) {
      switch (investigator.expansion.toLocaleLowerCase()) {
        case "ужас кингспорта":
          kingsport.push(investigator);
          break;
        case "ужас данвича":
          dunwich.push(investigator);
          break;
        case "ужас иннсмута":
          innsmouth.push(investigator);
          break;
        default:
          vanilla.push(investigator);
      }
    }
    return [
      vanilla,
      kingsport,
      dunwich,
      innsmouth
    ];
  }).then(([vanilla, kingsport, dunwich, innsmouth]) => {
    writeFile(vanilla, "investigators_classic");
    writeFile(kingsport, "investigators_kingsport");
    writeFile(dunwich, "investigators_dunwich");
    writeFile(innsmouth, "investigators_innsmouth");
  });

}

function writeItemsToFile() {
  getItemsJson().then((items) => {
    const vanilla: Item[] = [];
    const kingsport: Item[] = [];
    const dunwich: Item[] = [];
    const innsmouth: Item[] = [];
    for (let item of items) {
      switch (item.expansion.toLocaleLowerCase()) {
        case "ужас кингспорта":
          kingsport.push(item);
          break;
        case "ужас данвича":
          dunwich.push(item);
          break;
        case "ужас иннсмута":
          innsmouth.push(item);
          break;
        default:
          vanilla.push(item);
      }
    }
    return [
      vanilla,
      kingsport,
      dunwich,
      innsmouth
    ];
  }).then(([vanilla, kingsport, dunwich, innsmouth]) => {
    writeFile(vanilla, "items_classic");
    writeFile(kingsport, "items_kingsport");
    writeFile(dunwich, "items_dunwich");
    writeFile(innsmouth, "items_innsmouth");
  });
}

function writeFile(json: Object, filename: string) {
  fs.mkdir("./out", { recursive: true });
  fs.writeFile(`./out/${filename}.json`, JSON.stringify(json, null, 2), { encoding: "utf-8" });
}


main();