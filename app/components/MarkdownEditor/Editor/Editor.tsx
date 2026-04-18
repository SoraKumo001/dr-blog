import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";
import { useRef, useState, useTransition } from "react";
import { Separator } from "../../Commons/Separator";
import { MarkdownContent } from "../../MarkdownContent";
import { ToolBar } from "../ToolBar";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { DOMAttributes, FC } from "react";
import { useLoading } from "~/hooks/useLoading";
import { usePostEditor, type FormInput } from "~/hooks/usePostEditor";
import { getImageSize, useConvertImage } from "~/libs/convertImage";
import { useMarkdown } from "~/libs/markdownConverter";

export type { FormInput };

interface Props {
  id: string;
}

/**
 * Editor
 *
 * @param {Props} { id }
 */
export const Editor: FC<Props> = ({ id }) => {
  const {
    post,
    content,
    setEditorContent,
    control,
    handleSubmit,
    onSubmit,
    card,
    setCard,
    uploadPostImage,
    isLoading,
  } = usePostEditor(id);

  const monaco = useMonaco();
  const refEditor = useRef<editor.IStandaloneCodeEditor>(null);
  const refMarkdown = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(1);
  const [isConverting, convertImage] = useConvertImage();
  const [, startTransition] = useTransition();

  const handleEditorDidMount: OnMount = (editor) => {
    refEditor.current = editor;
    editor.onDidChangeCursorPosition((event) => {
      const currentLine = event.position.lineNumber;
      startTransition(() => {
        setCurrentLine(currentLine);
        const top = editor.getScrollTop();
        const linePos = editor.getTopForLineNumber(currentLine);
        const node = refMarkdown.current;
        if (node && event.source !== "api") {
          const nodes = node.querySelectorAll<HTMLElement>("[data-line]");
          const target = Array.from(nodes).find((n) => {
            const nodeLine = n.dataset.line?.match(/(\d+)/)?.[1];
            if (!currentLine) return false;
            return currentLine === Number(nodeLine);
          });
          if (target) {
            const { top: targetTop } = target.getBoundingClientRect();
            const { top: nodeTop } = node.getBoundingClientRect();
            node.scrollTop =
              targetTop - nodeTop + node.scrollTop - (linePos - top);
          }
        }
      });
    });
  };

  const processAndInsertImage = async (file: File) => {
    const editor = refEditor.current;
    const p = editor?.getPosition();
    if (editor && monaco && p) {
      const converted = await convertImage(file);
      if (!converted) throw "convert error";
      const result = await uploadPostImage(converted);
      if (result.data?.uploadPostImage.id) {
        const size = await getImageSize(converted);
        editor.executeEdits("", [
          {
            range: new monaco.Range(
              p.lineNumber,
              p.column,
              p.lineNumber,
              p.column,
            ),
            text: `![{"width":"${size.width}px","height":"${size.height}px"}](${result.data.uploadPostImage.id})`,
          },
        ]);
      }
    }
  };

  const handleUpload = (file: File) => {
    processAndInsertImage(file).catch(console.error);
  };

  const handleDrop: DOMAttributes<HTMLDivElement>["onDropCapture"] = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const editor = refEditor.current;
    if (editor && monaco) {
      const p = editor.getTargetAtClientPoint(
        event.clientX,
        event.clientY,
      )?.position;
      if (p) {
        editor.setPosition(p);
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          handleUpload(file);
        }
      }
    }
  };

  const handleDragOver: DOMAttributes<HTMLDivElement>["onDragOver"] = (event) => {
    event.preventDefault();
  };

  useLoading([isLoading, isConverting]);
  
  const [children] = useMarkdown({
    markdown: content ?? post?.content,
  });

  if (isLoading && !post) return null;
  if (!post) return null;

  return (
    <form
      className="fixed top-12 bottom-0 flex w-full flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ToolBar post={post} control={control} onCard={setCard} />
      <div className="top-0 flex h-full flex-1 overflow-hidden">
        <Separator>
          <div
            className="h-full"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            onDropCapture={handleDrop}
            onDragOver={handleDragOver}
            onPasteCapture={(e) => {
              Array.from(e.clipboardData.files).forEach((item) => {
                if (item.type.startsWith("image/")) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpload(item);
                }
              });
            }}
          >
            <MonacoEditor
              language="markdown"
              defaultValue={content ?? post.content}
              onChange={(e) => setEditorContent(e ?? "")}
              onMount={handleEditorDidMount}
              options={{
                renderControlCharacters: true,
                renderWhitespace: "boundary",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingStrategy: "advanced",
                minimap: { enabled: false },
                dragAndDrop: true,
                dropIntoEditor: { enabled: true },
                contextmenu: false,
                occurrencesHighlight: "off",
                renderLineHighlight: "none",
                quickSuggestions: false,
                wordBasedSuggestions: "off",
                language: "markdown",
                selectOnLineNumbers: true,
              }}
            />
          </div>
          <div
            ref={refMarkdown}
            className="relative h-full overflow-y-auto px-4"
          >
            <MarkdownContent
              onClick={(line, offset) => {
                const editor = refEditor.current;
                const node = refMarkdown.current;
                if (editor && node) {
                  const linePos = editor.getTopForLineNumber(line);
                  editor.setScrollTop(linePos - offset + node.scrollTop);
                  editor.setPosition({ lineNumber: line, column: 1 });
                }
              }}
              line={currentLine}
              edit
            >
              {children}
            </MarkdownContent>
          </div>
        </Separator>
      </div>
    </form>
  );
};
