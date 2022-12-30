import { SourceLocation } from "./syntax.mjs";

export class Token {
  readonly location: SourceLocation;
  value = "";

  constructor(opts: SourceLocation & { value?: string }) {
    const { value, ...location } = opts;
    this.value = value ?? "";
    this.location = location;
  }

  get span() {
    return this.value.length;
  }

  get hasChars() {
    return !!this.value.length;
  }

  get isNumber() {
    return /^[0-9]+$/.test(this.value);
  }

  get first(): string | undefined {
    return this.value[0];
  }

  addChar(string: string) {
    this.value += string;
  }

  is(string?: string) {
    return this.value === string;
  }
}
