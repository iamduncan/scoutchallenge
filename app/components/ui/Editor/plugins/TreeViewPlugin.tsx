import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.js";
import { TreeView } from "@lexical/react/LexicalTreeView.js";

export default function TreeViewPlugin() {
  const [ editor ] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="tree-view-output rounded-b-md"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      treeTypeButtonClassName="debug-tree-type-button"
      editor={editor}
    />
  );
}
