import { Expr } from "./expr.js";
import { Syntax, SyntaxMetadata } from "./syntax.js";
import { ObjectType, Type } from "./types.js";

export class ObjectLiteral extends Syntax {
  readonly syntaxType = "object-literal";
  type?: ObjectType;
  fields: ObjectLiteralField[];

  constructor(opts: SyntaxMetadata & { fields: ObjectLiteralField[] }) {
    super(opts);
    this.fields = opts.fields;
    this.fields.forEach((f) => (f.initializer.parent = this));
  }

  clone(parent?: Expr): ObjectLiteral {
    return new ObjectLiteral({
      ...super.getCloneOpts(parent),
      fields: this.fields.map(({ name, initializer }) => ({
        name,
        initializer: initializer.clone(),
      })),
    });
  }

  toJSON(): object {
    return [
      "object",
      `ObjectLiteral-${this.syntaxId}`,
      this.fields.map((f) => [f.name, f.initializer.toJSON()]),
    ];
  }
}

export type ObjectLiteralField = {
  name: string;
  initializer: Expr;
  type?: Type;
};
