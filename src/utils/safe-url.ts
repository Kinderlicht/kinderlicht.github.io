const siteUrl = "https://www.kinderlicht-wallersdorf.de";

// API-provided registration links must navigate to a web page, never execute code.
export function safeWebUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value, siteUrl);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    // Invalid URLs should not produce a registration button.
  }

  return undefined;
}
