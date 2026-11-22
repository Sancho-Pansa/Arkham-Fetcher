import ItemCard from "./ItemCard";

export default class Possessions {
  money: number;
  clues: number;
  commons: ItemCard;
  uniques: ItemCard;
  spells: ItemCard;
  skills: ItemCard;
  allies: ItemCard;

  constructor(
    money: number = 0,
    clues: number = 0,
    commons: ItemCard = new ItemCard(),
    uniques: ItemCard = new ItemCard(),
    spells: ItemCard = new ItemCard(),
    skills: ItemCard = new ItemCard(),
    allies: ItemCard = new ItemCard()
  ) {
    this.money = money;
    this.clues = clues;
    this.commons = commons;
    this.uniques = uniques;
    this.spells = spells;
    this.skills = skills;
    this.allies = allies;
  }
}