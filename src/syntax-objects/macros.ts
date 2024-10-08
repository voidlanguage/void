import { Block } from "./block.js";
import type { Expr } from "./expr.js";
import { Identifier } from "./identifier.js";
import { ScopedNamedEntityOpts, ScopedNamedEntity } from "./named-entity.js";

export type Macro = RegularMacro;

export class RegularMacro extends ScopedNamedEntity {
  readonly syntaxType = "macro";
  readonly macroType = "regular";
  readonly parameters: Identifier[] = [];
  readonly body: Block;

  constructor(
    opts: ScopedNamedEntityOpts & {
      parameters?: Identifier[];
      body: Block;
    }
  ) {
    super(opts);
    this.parameters = opts.parameters ?? [];
    this.body = opts.body;
    this.body.parent = this;
  }

  evaluate(evaluator: (expr: Expr) => Expr): Expr | undefined {
    return this.body.evaluate(evaluator);
  }

  getName(): string {
    return this.name.value;
  }

  toString() {
    return this.id;
  }

  clone(parent?: Expr | undefined): RegularMacro {
    return new RegularMacro({
      ...super.getCloneOpts(parent),
      parameters: this.parameters.map((p) => p.clone()),
      body: this.body.clone(),
    });
  }

  toJSON() {
    return [
      "regular-macro",
      this.id,
      ["parameters", ...this.parameters],
      this.body,
    ];
  }
}
