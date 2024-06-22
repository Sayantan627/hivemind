"use client";

import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { useCallback, useRef } from "react";
import type EditorJS from "@editorjs/editorjs";

interface EditorProps {
  subredditId: string;
}

const Editor = ({ subredditId }: EditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      subredditId,
      content: null,
    },
  });

  const ref = useRef<EditorJS>();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Code = (await import("@editorjs/code")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const Table = (await import("@editorjs/table")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to type your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
        },
      });
    }
  }, []);

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form id="subreddit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
};
export default Editor;
