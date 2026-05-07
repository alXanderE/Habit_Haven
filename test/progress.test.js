import test from "node:test";
import assert from "node:assert/strict";
import { calculateLevel, getXpRequiredForNextLevel } from "../src/utils/progress.js";

test("getXpRequiredForNextLevel scales by current level", () => {
  assert.equal(getXpRequiredForNextLevel(1), 100);
  assert.equal(getXpRequiredForNextLevel(2), 150);
  assert.equal(getXpRequiredForNextLevel(3), 200);
});

test("calculateLevel uses scaled xp thresholds", () => {
  assert.equal(calculateLevel(0), 1);
  assert.equal(calculateLevel(99), 1);
  assert.equal(calculateLevel(100), 2);
  assert.equal(calculateLevel(249), 2);
  assert.equal(calculateLevel(250), 3);
  assert.equal(calculateLevel(449), 3);
  assert.equal(calculateLevel(450), 4);
});
