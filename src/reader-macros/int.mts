import { Int } from "../syntax-objects/index.mjs";
import { ReaderMacro } from "./types.mjs";

export const intMacro: ReaderMacro = {
  tag: /^[+-]?\d+$/,
  macro: (_, { token }) =>
    new Int({
      value: Number(token.value),
      location: token.location,
    }),
};
