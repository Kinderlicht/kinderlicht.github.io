import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

export default function RichText({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkBreaks]}
      // Sanitize after parsing HTML, including HTML embedded in Markdown.
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {children}
    </Markdown>
  );
}
