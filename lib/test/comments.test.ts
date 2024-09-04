import { describe, expect, test } from "vitest";
import { extractAnnotations } from "..";
let codes = [
  // Single-line comment using //
  ["// foo", "c#"],
  ["// foo", "cpp"],
  ["// foo", "cs"],
  ["// foo", "csharp"],
  ["// foo", "f#"],
  ["// foo", "go"],
  ["// foo", "groovy"],
  ["// foo", "java"],
  ["// foo", "javascript"],
  ["// foo", "js"],
  ["// foo", "jsx"],
  ["// foo", "less"],
  ["// foo", "objective-c"],
  ["// foo", "objective-cpp"],
  ["// foo", "rust"],
  ["// foo", "scala"],
  ["// foo", "swift"],
  ["// foo", "typescript"],
  ["// foo", "ts"],
  ["// foo", "tsx"],
  ["// foo", "jison"],

  // Single-line comment using #
  ["# foo", "asm"],
  ["# foo", "bash"],
  ["# foo", "coffee"],
  ["# foo", "docker"],
  ["# foo", "dockerfile"],
  ["# foo", "elixir"],
  ["# foo", "fish"],
  ["# foo", "graphql"],
  ["# foo", "http"],
  ["# foo", "ini"],
  ["# foo", "julia"],
  ["# foo", "make"],
  ["# foo", "makefile"],
  ["# foo", "perl"],
  ["# foo", "python"],
  ["# foo", "py"],
  ["# foo", "r"],
  ["# foo", "shell"],
  ["# foo", "toml"],
  ["# foo", "txt"],
  ["# foo", "yaml"],
  ["# foo", "yml"],
  ["# foo", "zsh"],

  // Single-line comment using ;
  ["; foo", "lisp"],
  ["; foo", "clj"],
  ["; foo", "clojure"],
  ["; foo", "scheme"],
  [`" foo"`, "smalltalk"],

  // Single-line comment using --
  ["-- foo", "haskell"],
  ["-- foo", "sql"],
  ["-- foo", "lua"],

  // Special single-line comment formats
  ["# foo", "shell"],
  ["<!-- foo-->", "vue-html"],
  ["<!-- foo-->", "html"],

  // more
  ["// foo", "kotlin"],
  ["; foo", "clj"],
  ["; foo", "clojure"],
  ["<%# foo%>", "erb"],
  ["% foo", "erlang"],
  ["// foo", "glimmer-js"],
  ["// foo", "glimmer-ts"],
  ["-- foo", "elm"],
  ["// foo", "solidity"],
  ["REM foo", "bat"],
  ["REM foo", "batch"],

  // fail
  // ["// foo", "apl"],
  // ["# foo", "shellsession"],
  // ["(* foo *)", "ocaml"],

  // fails indented
  // ["* foo", "abap"],
];

describe.each(codes)("extract annotations", (code, lang) => {
  test(lang, async () => {
    let comments = [];
    const extracted = await extractAnnotations(code, lang, (comment) => {
      comments.push(comment);
      return null;
    });

    // if (comments.length === 0) {
    //   const h = await highlight(extracted.code, lang, "dark-plus", {
    //     scopes: true,
    //   });
    //   const line = h.lines[0];
    //   if (line.length == 1) {
    //     const token = line[0];
    //     if (token.scopes[0].startsWith("comment.line")) {
    //       console.log(lang, token.content, token.scopes);
    //     } else {
    //       console.log(lang, token.content, token.scopes);
    //     }
    //   } else {
    //     console.log(line);
    //     // TODO fix this
    //   }
    // }

    // const h = await highlight(extracted.code, lang, "dark-plus", {
    //   scopes: true,
    // });
    // const line = h.lines[0];
    // console.log(line);

    expect(comments).toHaveLength(1);
    expect(comments[0]).toBe(" foo");
    expect(extracted.code).toBe(code);
  });
});

describe.each(codes)("extract indented annotations", (code, lang) => {
  test(lang, async () => {
    let comments = [];
    const c = "  " + code;
    const extracted = await extractAnnotations(c, lang, (comment) => {
      comments.push(comment);
      return null;
    });

    expect(comments).toHaveLength(1);
    expect(comments[0]).toBe(" foo");
    expect(extracted.code).toBe(c);
  });
});
