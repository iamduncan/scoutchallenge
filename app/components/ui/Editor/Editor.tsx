import { JSDOM } from "jsdom";
import ExampleTheme from "./themes/ExampleTheme";
import LexicalComposer from "@lexical/react/LexicalComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import type { EditorState, LexicalEditor } from "lexical";

function Placeholder() {
  return <div className="editor-placeholder">Enter some text...</div>;
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: any) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
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
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex-1 rounded-md border-2 border-blue-500 text-lg leading-loose">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            initialEditorState={initialContent}
          />
          <LexicalOnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          {process.env.NODE_ENV !== "production" && <TreeViewPlugin />}
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <LexicalMarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
