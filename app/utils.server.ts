import { createHeadlessEditor } from "@lexical/headless";
import { $generateHtmlFromNodes } from "@lexical/html";
import { JSDOM } from "jsdom";

export const generateHTML = (editorState: string) => {
  const dom = new JSDOM();
  global.window = dom.window as any;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.DocumentFragment = dom.window.DocumentFragment;

  const editor = createHeadlessEditor({
    onError: (error) => {
      console.error(error);
    },
    nodes: [],
    namespace: "editor",
  });

  editor.setEditorState(editor.parseEditorState(editorState));

  let html = "";

  editor.update(() => {
    html = $generateHtmlFromNodes(editor, null);
  });

  return html;
};
