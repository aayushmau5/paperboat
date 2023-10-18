import { expect, test } from "bun:test";
import { WCharacter, WString, Woot } from ".";

test("init with empty sequence", () => {
  const doc = new Woot("a");
  expect(doc.internal()).toEqual([
    {
      id: "START",
      character: "",
      prevId: "",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "END",
      character: "",
      prevId: "START",
      nextId: "",
      isDeleted: false,
    },
  ]);
});

// TODO: make a loader and saver module to save the CRDT data

test("inserting a character", () => {
  const doc = new Woot("1");

  const insertOp = doc.generateInsert(1, "a");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  expect(doc.internal()).toEqual([
    {
      id: "START",
      character: "",
      prevId: "",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:0",
      character: "a",
      prevId: "START",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "END",
      character: "",
      prevId: "START",
      nextId: "",
      isDeleted: false,
    },
  ]);
});

test("insert multiple characters: one after another", () => {
  const doc = new Woot("1");

  let insertOp = doc.generateInsert(1, "a");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  insertOp = doc.generateInsert(2, "b");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  insertOp = doc.generateInsert(3, "c");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  expect(doc.internal()).toEqual([
    {
      id: "START",
      character: "",
      prevId: "",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:0",
      character: "a",
      prevId: "START",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:1",
      character: "b",
      prevId: "1:0",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:2",
      character: "c",
      prevId: "1:1",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "END",
      character: "",
      prevId: "START",
      nextId: "",
      isDeleted: false,
    },
  ]);

  expect(doc.value()).toBe("abc");
});

test("insert multiple characters: in middle", () => {
  const doc = new Woot("1");

  let insertOp = doc.generateInsert(1, "a");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  insertOp = doc.generateInsert(2, "b");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  insertOp = doc.generateInsert(2, "c");
  doc.ins(insertOp.wChar, insertOp.prevChar, insertOp.nextChar);

  expect(doc.internal()).toEqual([
    {
      id: "START",
      character: "",
      prevId: "",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:0",
      character: "a",
      prevId: "START",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "1:2",
      character: "c",
      prevId: "1:0",
      nextId: "1:1",
      isDeleted: false,
    },
    {
      id: "1:1",
      character: "b",
      prevId: "1:0",
      nextId: "END",
      isDeleted: false,
    },
    {
      id: "END",
      character: "",
      prevId: "START",
      nextId: "",
      isDeleted: false,
    },
  ]);

  expect(doc.value()).toBe("acb");
});

// TESTS:
// 1. Insertion
// 2. Deletion
// 3. Compaction
// 4. Concurrent insertion
// 5. Concurrent deletion
// 6. Multiple insertion
// 7. ithVisible test
// 8.
