import test from "node:test";
import assert from "node:assert/strict";
import { calculateLevel } from "../src/utils/progress.js";

test("calculateLevel increases every 100 xp", () => {
  assert.equal(calculateLevel(0), 1);
  assert.equal(calculateLevel(99), 1);
  assert.equal(calculateLevel(100), 2);
  assert.equal(calculateLevel(240), 3);
});
