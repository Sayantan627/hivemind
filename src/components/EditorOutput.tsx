import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";
import { any } from "zod";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  },
);

interface EditorOutputProps {
  content: any;
}

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;
  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt="image" src={src} fill className="object-contain" />
    </div>
  );
};

const CustomCodeRenderer = ({ data }: any) => {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code>{data.code}</code>
    </pre>
  );
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      data={content}
      className="text-sm"
      renderers={renderers}
    />
  );
};

export default EditorOutput;
