import type { Product } from "./core";
export function matchPlants(
  products: Product[],
  options: { light: string; care: string; pets: boolean },
): Product[];
