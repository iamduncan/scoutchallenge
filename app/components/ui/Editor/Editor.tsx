import lexicalCode from "@lexical/code";
import lexicalHashtag from "@lexical/hashtag";
import lexicalLink from "@lexical/link";
import lexicalList from "@lexical/list";
import lexicalMarkdown from "@lexical/markdown";
import lexicalComposer from "@lexical/react/LexicalComposer.js";
import lexicalEditable from "@lexical/react/LexicalContentEditable.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import lexicalHashtagPlugin from "@lexical/react/LexicalHashtagPlugin.js";
import lexicalHistoryPlugin from "@lexical/react/LexicalHistoryPlugin.js";
import lexicalLinkPlugin from "@lexical/react/LexicalLinkPlugin.js";
import lexicalListPlugin from "@lexical/react/LexicalListPlugin.js";
import lexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin.js";
import lexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin.js";
import lexicalRichTextPlugin from "@lexical/react/LexicalRichTextPlugin.js";
import lexicalRichText from "@lexical/rich-text";
import lexicalTable from "@lexical/table";

import { type EditorState, type LexicalEditor } from "lexical";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin.tsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin.tsx";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin.tsx";
import ToolbarPlugin from "./plugins/ToolbarPlugin.tsx";
import TreeViewPlugin from "./plugins/TreeViewPlugin.tsx";
import ExampleTheme from "./themes/ExampleTheme.ts";

const CodeHighlightNode = lexicalCode.CodeHighlightNode;
const CodeNode = lexicalCode.CodeNode;

const HashtagNode = lexicalHashtag.HashtagNode;

const AutoLinkNode = lexicalLink.AutoLinkNode;
const LinkNode = lexicalLink.LinkNode;

const ListItemNode = lexicalList.ListItemNode;
const ListNode = lexicalList.ListNode;
const TRANSFORMERS = lexicalMarkdown.TRANSFORMERS;
const LexicalComposer = lexicalComposer.LexicalComposer;
const ContentEditable = lexicalEditable.ContentEditable;
const HeadingNode = lexicalRichText.HeadingNode;
const QuoteNode = lexicalRichText.QuoteNode;
const TableCellNode = lexicalTable.TableCellNode;
const TableNode = lexicalTable.TableNode;
const TableRowNode = lexicalTable.TableRowNode;

const HashtagPlugin = lexicalHashtagPlugin.HashtagPlugin;
const HistoryPlugin = lexicalHistoryPlugin.HistoryPlugin;
const LinkPlugin = lexicalLinkPlugin.LinkPlugin;
const ListPlugin = lexicalListPlugin.ListPlugin;
const MarkdownShortcutPlugin =
  lexicalMarkdownShortcutPlugin.MarkdownShortcutPlugin;
const OnChangePlugin = lexicalOnChangePlugin.OnChangePlugin;
const RichTextPlugin = lexicalRichTextPlugin.RichTextPlugin;

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
