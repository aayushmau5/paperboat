import { WCharacter } from ".";

type OperationTypes = "ins" | "del";

export class Operation {
  // what sort of input will the operation take?
  op_type: OperationTypes;
  op_char: WCharacter;
  constructor(type: OperationTypes, char: WCharacter, position: number) {
    this.op_type = type;
    this.op_char = char;
  }

  type() {
    return this.op_type;
  }

  char() {
    return this.op_char;
  }
}
