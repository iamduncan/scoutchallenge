import lexicalCode from "@lexical/code";
import lexicalReact from "@lexical/react/LexicalComposerContext.js";
import { useEffect } from "react";

export default function CodeHighlightPlugin() {
  const registerCodeHighlighting = lexicalCode.registerCodeHighlighting;
  const useLexicalComposerContext = lexicalReact.useLexicalComposerContext;
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor, registerCodeHighlighting]);
  return null;
}
