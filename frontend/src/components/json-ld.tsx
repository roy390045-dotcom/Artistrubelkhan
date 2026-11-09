/**
 * Structured data for Google, Bing and social crawlers. `<` is escaped so a title or
 * description can never close the script tag (the pattern the Next.js JSON-LD guide uses).
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
