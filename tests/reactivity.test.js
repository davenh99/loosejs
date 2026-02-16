import { test } from "node:test";
import assert from "node:assert";
import { signal, effect } from "../src/reactivity.js";

test("signal creates getter and setter", () => {
  const [count, setCount] = signal(0);
  assert.strictEqual(count(), 0);
  setCount(5);
  assert.strictEqual(count(), 5);
});

test("effect re-runs when signal changes", () => {
  let runCount = 0;
  const [count, setCount] = signal(0);
  effect(() => {
    count();
    runCount++;
  });
  setCount(1);
  assert.strictEqual(runCount, 2);
});

test("effect doesn't run anymore after disposing", () => {
  let runCount = 0;
  const [count, setCount] = signal(0);
  const dispose = effect(() => {
    count();
    runCount++;
  });
  setCount(1);
  setCount(2);
  dispose();
  setCount(3);
  setCount(4);
  assert.strictEqual(runCount, 3);
});
