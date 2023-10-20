import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.js";
import { useEffect } from "react";

export default function CodeHighlightPlugin() {
  const [ editor ] = useLexicalComposerContext();
  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [ editor ]);
  return null;
}
