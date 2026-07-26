import { marked } from "marked";

/**
 * Blog post content is authored as Markdown by trusted admins (not public
 * user input), so this intentionally skips HTML sanitization — see the
 * Step 4 report for the reasoning and when to revisit it.
 */
export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false, gfm: true, breaks: true });
}
