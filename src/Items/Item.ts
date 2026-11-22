export interface ItemConfig {
  type?: string,
  passive?: string,
  text?: string,
  active?: {
    phase: string,
    text: string
  }
}

export default class CommonItem {
    public readonly name: string;
    public readonly expansion: string;
    public readonly price: number;
    public readonly hands: number;
    public readonly type: string | undefined;
    public readonly passive: string | undefined;
    public readonly text: string | undefined;
    public readonly active: {
      phase: string,
      text: string
    } | undefined;

  constructor(
    name: string,
    expansion: string,
    price: number,
    hands: number,
    config: ItemConfig = {}
  ) {
    this.name = name;
    this.expansion = expansion;
    this.hands = hands;
    this.price = price;
    this.type = config.type;
    this.passive = config.passive;
    this.text = config.text;
    this.active = config.active;
  }
}