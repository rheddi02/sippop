import { ChocolateMenu } from "./chocolateMenu";
import { CoffeeMenu } from "./coffeeMenu";
import { MatchaMenu } from "./matchaMenu";
import { MilkMenu } from "./milkMenu";
import { OtherMenu } from "./otherMenu";
import { SignatureMenu } from "./signature";
import { SodaMenu } from "./sodaMenu";

export const mockMenu = [
  ...SodaMenu,
  ...MilkMenu,
  ...CoffeeMenu,
  ...ChocolateMenu,
  ...MatchaMenu,
  ...SignatureMenu,
  ...OtherMenu,
];
