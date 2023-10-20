import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer.js";
import { ContentEditable } from "@lexical/react/LexicalContentEditable.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin.js";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin.js";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin.js";
import { ListPlugin } from "@lexical/react/LexicalListPlugin.js";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin.js";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin.js";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin.js";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { type EditorState, type LexicalEditor } from "lexical";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin.tsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin.tsx";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin.tsx";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";
import TreeViewPlugin from "./plugins/TreeViewPlugin.tsx";
import ExampleTheme from "./themes/ExampleTheme.ts";

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

const editorConfig = {
  namespace: "editor",
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    HashtagNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

type Props = {
  initialContent?: string;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
};

export default function Editor({ initialContent, onChange }: Props) {
  return typeof window !== "undefined" ? (
    <LexicalComposer
      initialConfig={{ ...editorConfig, editorState: initialContent }}
    >
      <div className="editor-container flex-1 rounded-md border-2 border-blue-500 text-lg leading-loose">
        <ToolbarPlugin />
        <div className="editor-inner">
          <HashtagPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary.default}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          {process.env.NODE_ENV !== "production" && <TreeViewPlugin />}
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  ) : (
    <></>
  );
}
