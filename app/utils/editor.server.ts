import lexicalHashtag from "@lexical/hashtag";
import lexicalHeadless from "@lexical/headless";
import lexicalHtml from "@lexical/html";
import { JSDOM } from "jsdom";
import exampleTheme from "#app/components/ui/Editor/themes/ExampleTheme.ts";

export const generateHTML = (editorState?: string | null) => {
  const HashtagNode = lexicalHashtag.HashtagNode;
  const createHeadlessEditor = lexicalHeadless.createHeadlessEditor;

  if (!editorState) {
    return "";
  }
  const dom = new JSDOM();
  global.window = dom.window as any;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.DocumentFragment = dom.window.DocumentFragment;

  const editor = createHeadlessEditor({
    onError: (error: any) => {
      console.error(error);
    },
    nodes: [HashtagNode],
    namespace: "editor",
    theme: exampleTheme,
  });

  editor.setEditorState(editor.parseEditorState(editorState));

  const $generateHtmlFromNodes = lexicalHtml.$generateHtmlFromNodes;
  let html = "";

  editor.update(() => {
    html = $generateHtmlFromNodes(editor, null);
  });

  return html;
};
