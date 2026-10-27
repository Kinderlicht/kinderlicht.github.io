import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import type { Event } from "../content/events/events";

export default function EventDescription({
  description,
  htmlContent,
}: Pick<Event, "description" | "htmlContent">) {
  const content =
    htmlContent?.trim() ||
    description?.trim() ||
    "Es liegt keine Beschreibung vor.";

  return (
    <div className="prose prose-sm max-w-none text-gray-700 [overflow-wrap:anywhere] prose-headings:font-bold prose-headings:text-gray-800 prose-p:my-3 prose-a:text-orange-700 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-orange-900 prose-strong:text-gray-800 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-img:rounded-xl [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      <Markdown
        remarkPlugins={[remarkBreaks]}
        // Parse embedded HTML before sanitizing so both formats share the same rules.
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </Markdown>
    </div>
  );
}
