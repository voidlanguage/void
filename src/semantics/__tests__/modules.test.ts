import { registerModules } from "../modules.js";
import { List } from "../../syntax-objects/list.js";
import { stdPath } from "../../parser/index.js";
import { test } from "vitest";

test("module registration", (t) => {
  const result = registerModules(input);
  t.expect(result).toMatchSnapshot();
});

const input = {
  files: {
    "/Users/drew/projects/voyd/example.voyd": new List({
      value: [
        "ast",
        ["use", ["::", ["::", "std", "macros"], "all"]],
        [
          "fn",
          ["fib", [":", "n", "i32"]],
          "->",
          "i32",
          [
            "block",
            [
              "if",
              ["<=", "n", 1],
              [":", "then", ["block", "n"]],
              [
                ":",
                "else",
                [
                  "block",
                  ["+", ["fib", ["-", "n", 1]], ["fib", ["-", "n", 2]]],
                ],
              ],
            ],
          ],
        ],
        [
          "fn",
          ["main"],
          [
            "block",
            ["let", ["=", "x", ["+", 10, ["block", ["+", 20, 30]]]]],
            [
              "let",
              [
                "=",
                "y",
                [
                  "if",
                  [">", "x", 10],
                  [":", "then", ["block", 10]],
                  [":", "else", ["block", 20]],
                ],
              ],
            ],
            [
              "call",
              "this",
              "while",
              [
                "=>",
                [],
                [
                  "if",
                  [">", "x", 10],
                  [":", "then", ["block", ["-=", "x", 1]]],
                  [":", "else", ["block", ["+=", "x", 1]]],
                ],
              ],
            ],
            [
              "let",
              [
                "=",
                "n",
                [
                  "if",
                  [">", ["len", "args"], 1],
                  [
                    ":",
                    "then",
                    [
                      "block",
                      ["log", "console", ["string", "Hey there!"]],
                      ["unwrap", ["parseInt", ["at", "args", 1]]],
                    ],
                  ],
                  [":", "else", ["block", 10]],
                ],
              ],
            ],
            ["let", ["=", "x2", 10]],
            ["let", ["=", "z", ["nothing"]]],
            ["let", ["=", "test_spacing", ["fib", "n"]]],
            ["let", ["=", "result", ["fib", "n"]]],
          ],
        ],
      ],
    }),
    [`${stdPath}/deep/nested/hey.voyd`]: new List({
      value: [
        "ast",
        ["use", ["::", ["::", "super", "macros"], "all"]],
        [
          "pub",
          "fn",
          ["hey", [":", "src", "i32"], [":", "dest", "i32"]],
          "->",
          "i32",
          ["block"],
        ],
      ],
    }),
    [`${stdPath}/deep/nested.voyd`]: new List({
      value: [
        "ast",
        ["pub", ["use", ["::", "hey", "all"]]],
        [
          "pub",
          "fn",
          ["nested", [":", "src", "i32"], [":", "dest", "i32"]],
          "->",
          "i32",
          ["block"],
        ],
      ],
    }),
    [`${stdPath}/deep/mod.voyd`]: new List({
      value: [
        "ast",
        ["pub", ["use", ["::", "hey", "all"]]],
        [
          "pub",
          "fn",
          ["deeply", [":", "src", "i32"], [":", "dest", "i32"]],
          "->",
          "i32",
          ["block"],
        ],
      ],
    }),
    [`${stdPath}/memory.voyd`]: new List({
      value: [
        "ast",
        ["use", ["::", ["::", "super", "macros"], "all"]],
        ["global", "let", ["=", "header-size", 8]],
        ["global", "let", ["=", "size-index", 0]],
        ["global", "let", ["=", "type-index", 4]],
        ["global", "var", ["=", "stack-pointer", 0]],
        [
          "pub",
          "fn",
          ["copy", [":", "src", "i32"], [":", "dest", "i32"]],
          "->",
          "i32",
          [
            "block",
            [
              "bnr",
              ["memory", "copy", "voyd"],
              ["dest", "src", ["size", "src"]],
            ],
            "dest",
          ],
        ],
      ],
    }),
    [`${stdPath}/index.voyd`]: new List({
      value: ["ast", ["pub", ["use", ["::", "macros", "all"]]]],
    }),
  },
  srcPath: "/Users/drew/projects/voyd",
  indexPath: "/Users/drew/projects/voyd/index.voyd",
};
