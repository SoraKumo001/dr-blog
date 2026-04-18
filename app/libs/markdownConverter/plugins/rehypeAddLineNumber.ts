import { visit } from "unist-util-visit";
import type { Root } from "hast";
import type { Plugin } from "unified";

const inlineTags = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
  "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp",
  "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr",
  "del", "img", "svg", "path"
]);

/**
 *  各ノードに行番号とカーソル位置の情報を埋め込む
 */
export const rehypeAddLineNumber: Plugin = () => {
  return (tree: Root) => {
    visit(
      tree,
      "element",
      (node) => {
        const start = node.position?.start?.line;
        const end = node.position?.end?.line;
        if (start && end && !inlineTags.has(node.tagName) && !node.properties["data-inline-code"]) {
          node.properties = {
            ...node.properties,
            ["data-line"]: start,
          };
        }
      },
      true
    );
  };
};
