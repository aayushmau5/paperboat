export type Id = string;

export type WCharacter = {
  id: Id; // id of current W-character
  character: string; // the value of the character
  isDeleted: boolean; // is the character deleted
  prevId: Id; // id of previous W-character
  nextId: Id; // id of next W-character
};

export type WString = WCharacter[];

export type OperationType = "ins" | "del";

export class Woot {
  seq: WString;
  siteId: string;
  clock: number;
  pool: [OperationType, WCharacter][];

  constructor(siteId: string) {
    this.seq = [];
    this.pool = [];
    this.siteId = siteId;
    this.clock = 0;
    this.init();
  }

  init() {
    // start of the document
    const start: WCharacter = {
      id: "START",
      character: "", // TODO: does it make sense to put null here?
      isDeleted: false,
      nextId: "END",
      prevId: "",
    };

    // end of the document
    const end: WCharacter = {
      id: "END",
      character: "",
      isDeleted: false,
      nextId: "",
      prevId: "START",
    };

    this.seq.push(start, end);
  }

  // return position of element c in Seq
  pos(char: WCharacter): number {
    let position = 0;
    for (const v of this.seq) {
      if (v.id === char.id) {
        return position;
      }
      position++;
    }
    return -1;
  }

  // insert element c in Seq at position p
  insert(c: WCharacter, p: number): void {
    this.seq.splice(p, 0, c);
  }

  // returns the part of Seq between the elements c and d(exclusive)
  subseq(prevChar: WCharacter, nextChar: WCharacter): WCharacter[] {
    const startingIndex = this.pos(prevChar);
    const endingIndex = this.pos(nextChar);
    return this.seq.slice(startingIndex + 1, endingIndex);
  }

  // returns true if c can be found in Seq
  contains(charId: string): boolean {
    for (const char of this.seq) {
      if (char.id === charId) return true;
    }
    return false;
  }

  // the representation of W-String
  value(): string {
    let value = "";
    for (const char of this.seq) {
      if (!char.isDeleted && char.id !== "START" && char.id !== "END") {
        value += char.character;
      }
    }
    return value;
  }

  // get the ith visible character
  ithVisible(position: number, next = false): WCharacter {
    const ithChar = this.seq[position];
    if (ithChar.isDeleted) {
      if (next) {
        return this.ithVisible(position + 1);
      }
      return this.ithVisible(position - 1);
    }
    return ithChar;
  }

  // insert W-character between previous and next character(if they exist)
  ins(char: WCharacter, prevChar: WCharacter, nextChar: WCharacter) {
    const subseqChars = this.subseq(prevChar, nextChar);
    if (subseqChars.length === 0) {
      const position = this.pos(nextChar);
      this.insert(char, position);
      return;
    }

    const filteredChars = subseqChars.filter(
      (char) => char.prevId === prevChar.id && char.nextId === nextChar.id
    );

    let i = 0;
    while (
      i < filteredChars.length &&
      this.isBeforeId(filteredChars[i], char)
    ) {
      i++;
    }
    this.ins(char, filteredChars[i - 1], filteredChars[i]);
  }

  isBeforeId(char1: WCharacter, char2: WCharacter): boolean {
    const [firstId, firstClock] = char1.id.split(":");
    const [secondId, secondClock] = char2.id.split(":");
    const firstIdNum = +firstId;
    const secondIdNum = +secondId;
    const firstClockNum = +firstClock;
    const secondClockNum = +secondClock;
    if (firstIdNum === secondIdNum) {
      return firstClockNum < secondClockNum;
    }
    return firstIdNum < secondIdNum;
  }

  // delete W-Character(if it exists)
  del(char: WCharacter) {
    const position = this.pos(char);
    if (position === -1) return;
    char.isDeleted = true;
    this.seq[position] = char;
    return;
  }

  // returns the internal value of the document
  internal() {
    return this.seq;
  }

  generateInsert(position: number, char: string) {
    // assuming position starts at 1
    const clock = this.clock++;
    const prevChar = this.ithVisible(position - 1);
    const nextChar = this.ithVisible(position, true);
    const wChar: WCharacter = {
      id: `${this.siteId}:${clock}`,
      character: char,
      isDeleted: false,
      prevId: prevChar.id,
      nextId: nextChar.id,
    };
    return { wChar, prevChar, nextChar };
  }

  generateDelete(position: number) {
    const wChar = this.ithVisible(position);
    return wChar;
  }

  isOkToExecute(operationType: OperationType, wChar: WCharacter) {
    if (operationType == "del") {
      return this.contains(wChar.id);
    }
    return this.contains(wChar.prevId) && this.contains(wChar.nextId);
  }
}

// to handle loading from and saving to file
class FileOp {}
