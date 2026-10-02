export function matchPlants(products, { light, care, pets }) {
  return products
    .filter(
      (p) =>
        (!pets || p.pet) &&
        (care !== "easy" || p.care === "easy") &&
        (light !== "low" || p.light === "low"),
    )
    .sort((a, b) => Number(b.light === light) - Number(a.light === light));
}
