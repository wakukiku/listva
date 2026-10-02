import { test } from "node:test";
import assert from "node:assert/strict";
import { matchPlants } from "../src/domain.mjs";
test("pet, care and light constraints apply together; empty matches are honest", () => {
  const p = [
    { id: "a", light: "low", care: "easy", pet: false },
    { id: "b", light: "medium", care: "easy", pet: true },
    { id: "c", light: "medium", care: "medium", pet: true },
  ];
  assert.deepEqual(
    matchPlants(p, { light: "medium", care: "easy", pets: true }).map(
      (p) => p.id,
    ),
    ["b"],
  );
  assert.equal(
    matchPlants(p, { light: "low", care: "easy", pets: true }).length,
    0,
  );
  assert.equal(
    matchPlants(p, { light: "medium", care: "medium", pets: false }).length,
    3,
  );
});
