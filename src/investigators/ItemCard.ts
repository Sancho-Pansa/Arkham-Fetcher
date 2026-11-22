export default class ItemCard {
  random: number;
  fixed: string[];
  constructor(
    random: number = 0,
    fixed: string[] = []
  ) {
    this.random = random;
    this.fixed = fixed;
  }
}