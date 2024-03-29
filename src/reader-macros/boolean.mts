import { Bool } from "../syntax-objects/index.mjs";
import { ReaderMacro } from "./types.mjs";

export const booleanMacro: ReaderMacro = {
  tag: /^true|false$/,
  macro: (_, { token }) =>
    new Bool({
      value: token.is("true"),
      location: token.location,
    }),
};
