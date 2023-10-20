import { $getListDepth, $isListItemNode, $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext.js";
import  { type RangeSelection, type NodeSelection, type GridSelection ,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  INDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useEffect } from "react";

function getElementNodesInSelection(
  selection: RangeSelection | NodeSelection | GridSelection
) {
  const nodesInSelection = selection.getNodes();

  // anchor exists on selection

  if (nodesInSelection.length === 0) {
    return new Set([
      "anchor" in selection && selection.anchor.getNode().getParentOrThrow(),
      "focus" in selection && selection.focus.getNode().getParentOrThrow(),
    ]);
  }

  return new Set(
    nodesInSelection.map((n: any) =>
      $isElementNode(n) ? n : n.getParentOrThrow()
    )
  );
}

function isIndentPermitted(maxDepth: number) {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return false;
  }

  const elementNodesInSelection = getElementNodesInSelection(selection);

  let totalDepth = 0;

  for (const elementNode of elementNodesInSelection) {
    if ($isListNode(elementNode)) {
      totalDepth = Math.max($getListDepth(elementNode) + 1, totalDepth);
    } else if ($isListItemNode(elementNode)) {
      const parent = elementNode.getParent();
      if (parent === null || !$isListNode(parent)) {
        throw new Error(
          "ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent."
        );
      }

      totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
    }
  }

  return totalDepth <= maxDepth;
}

export default function ListMaxIndentLevelPlugin({ maxDepth }: any) {
  const [ editor ] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => !isIndentPermitted(maxDepth ?? 7),
      COMMAND_PRIORITY_HIGH
    );
  }, [ editor, maxDepth ]);

  return null;
}
