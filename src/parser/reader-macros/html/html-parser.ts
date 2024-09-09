import { Bool } from "../../../syntax-objects/bool.js";
import { Expr } from "../../../syntax-objects/expr.js";
import { List } from "../../../syntax-objects/list.js";
import { StringLiteral } from "../../../syntax-objects/string-literal.js";
import { CharStream } from "../../char-stream.js";

/**
 * NOTE: This file was partially generated by AI (GPT-4o).
 */

type ParseOptions = {
  onUnescapedCurlyBrace: (stream: CharStream) => Expr | undefined;
};

export class HTMLParser {
  private stream: CharStream;
  private options: ParseOptions;

  constructor(stream: CharStream, options: ParseOptions) {
    this.stream = stream;
    this.options = options;
  }

  parse(startElement?: string): List {
    const nodes = new List({});
    const node = this.parseNode(startElement);
    if (node) {
      nodes.push(node);
    }
    return nodes;
  }

  private parseNode(startElement?: string): Expr | null {
    if (startElement) {
      return this.parseElement(startElement);
    }

    this.consumeWhitespace();
    if (this.stream.next === "<") {
      return this.parseElement();
    } else {
      return this.parseText();
    }
  }

  private parseElement(startElement?: string): List | null {
    if (!startElement && this.stream.consumeChar() !== "<") return null;

    const tagName = startElement ?? this.parseTagName();
    const attributes = this.parseAttributes();
    const selfClosing = this.stream.next === "/";

    if (selfClosing) {
      this.stream.consumeChar(); // Consume '/'
    }

    if (this.stream.consumeChar() !== ">") {
      throw new Error("Malformed tag");
    }

    const elementNode = new List({
      location: this.stream.currentSourceLocation(),
      value: [tagName, ["attributes", ":", attributes]],
    });

    if (!selfClosing) {
      const children = this.parseChildren(tagName);
      elementNode.push(["children", ":", children]);
    }

    return elementNode;
  }

  private parseTagName(): string {
    let tagName = "";
    while (/[a-zA-Z0-9]/.test(this.stream.next)) {
      tagName += this.stream.consumeChar();
    }
    return tagName;
  }

  private parseAttributes(): List {
    const attributes = dict();
    const args = array();
    attributes.push(args);
    while (this.stream.next !== ">" && this.stream.next !== "/") {
      this.consumeWhitespace();
      const name = this.parseAttributeName();
      if (this.stream.next === "=") {
        this.stream.consumeChar(); // Consume '='
        const value = this.parseAttributeValue();
        args.push(dictItem(name, value));
      } else {
        args.push(dictItem(name, new Bool({ value: true })));
      }
      this.consumeWhitespace();
    }

    return attributes;
  }

  private parseAttributeName(): string {
    let name = "";
    while (/[a-zA-Z0-9-]/.test(this.stream.next)) {
      name += this.stream.consumeChar();
    }
    return name;
  }

  private parseAttributeValue(): Expr {
    const quote = this.stream.next;
    if (quote === "{") {
      const expr = this.options.onUnescapedCurlyBrace(this.stream);

      if (!expr) {
        throw new Error(
          "Unescaped curly brace must be followed by an expression"
        );
      }

      return expr;
    }

    if (quote !== '"' && quote !== "'") {
      throw new Error("Attribute value must be quoted");
    }

    this.stream.consumeChar(); // Consume the opening quote

    let text = "";
    while (this.stream.next !== quote) {
      text += this.stream.consumeChar();
    }
    this.stream.consumeChar(); // Consume the closing quote
    return new StringLiteral({ value: text });
  }

  private parseChildren(tagName: string): Expr[] {
    this.consumeWhitespace();
    const children: Expr[] = [];
    while (
      this.stream.hasCharacters &&
      !(this.stream.at(0) === `<` && this.stream.at(1) === `/`)
    ) {
      if (this.stream.next === "{") {
        const expr = this.options.onUnescapedCurlyBrace(this.stream);
        if (expr) children.push(expr);
        this.consumeWhitespace();
        continue;
      }

      const node = this.parseNode();
      if (node) {
        children.push(node);
      }

      this.consumeWhitespace();
    }

    if (this.stream.hasCharacters && this.stream.next === `<`) {
      this.stream.consumeChar(); // Consume '<'
      if (this.stream.consumeChar() !== "/") {
        throw new Error(`Expected closing tag </${tagName}>`);
      }
      const closingTagName = this.parseTagName();
      if (closingTagName !== tagName) {
        throw new Error(
          `Mismatched closing tag, expected </${tagName}> but got </${closingTagName}>`
        );
      }
      if (this.stream.consumeChar() !== ">") {
        throw new Error("Malformed closing tag");
      }
    }

    return children;
  }

  private parseText(): Expr {
    const node = array();
    node.location = this.stream.currentSourceLocation();

    let text = "";
    while (this.stream.hasCharacters && this.stream.next !== "<") {
      if (this.stream.next === "{") {
        if (text) node.push(new StringLiteral({ value: text }));
        text = "";
        const expr = this.options.onUnescapedCurlyBrace(this.stream);
        if (expr) node.push(expr);
      }

      text += this.stream.consumeChar();
    }

    if (text) node.push(new StringLiteral({ value: text }));
    node.location.endColumn = this.stream.column;
    node.location.endIndex = this.stream.position;
    return node;
  }

  private consumeWhitespace(): void {
    while (/\s/.test(this.stream.next)) {
      this.stream.consumeChar();
    }
  }
}

const dict = () => new List({}).insertFnCall("dict");
const dictItem = (key: string, value: Expr) => array().push(key, value);
const array = () => new List({}).insertFnCall("array");
