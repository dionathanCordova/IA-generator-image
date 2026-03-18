export enum ItemType {
  HELMET = "Helmet",
  ARMOR = "Armor",
  BOOTS = "Boots",
  WEAPON = "Weapon",
  OFFHAND = "Off-hand",
  AMULET = "Amulet",
  RING = "Ring",
  GLOVES = "Gloves",
  PANTS = "Pants",
  QUIVER = "Quiver",
}

export enum Rarity {
  COMMON = "Common",
  INTERMEDIATE = "Intermediate",
  EXCELLENT = "Excellent",
  EPIC = "Epic",
  LEGENDARY = "Legendary",
}

export enum CharacterClass {
  WARRIOR = "Warrior",
  MAGE = "Mage",
  HUNTER = "Hunter",
  LORD = "Lord",
  ASSASSIN = "Assassin",
}

export interface RPGItem {
  id: string;
  name: string;
  type: ItemType;
  prompt: string;
  rarity?: Rarity;
}

export interface RPGSet {
  id: string;
  name: string;
  theme: string;
  bonus: string;
  color: string;
  accentColor: string;
  items: RPGItem[];
}
