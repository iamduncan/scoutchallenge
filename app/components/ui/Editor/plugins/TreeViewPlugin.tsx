import lexicalComposer from '@lexical/react/LexicalComposerContext.js';
import lexicalTreeView from '@lexical/react/LexicalTreeView.js';

export default function TreeViewPlugin() {
  const useLexicalComposerContext = lexicalComposer.useLexicalComposerContext;
  const [editor] = useLexicalComposerContext();
  const TreeView = lexicalTreeView.TreeView;

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
