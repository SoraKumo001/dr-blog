import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Plugin } from "unified";

/**
 *  codeに言語情報、inlineCodeにインラインフラグを追加
 */
export const remarkCode: Plugin = () => {
  return (tree: Root) => {
    visit(tree, "code", (node) => {
      node.data = { ...node.data, hProperties: { "data-language": node.lang } };
    });
    visit(tree, "inlineCode", (node) => {
      node.data = { ...node.data, hProperties: { "data-inline-code": "true" } };
    });
  };
};
