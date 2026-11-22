/**
 * Parses wikitext and returns plain text without links, tags, or templates
 * @param wikitext - The input wikitext string
 * @returns Clean plain text
 */
export default function sanitizeWikitext(wikitext: string): string {
  if (!wikitext) {
    return "";
  }

  let text = wikitext;

  // Remove nested templates {{...}} (handle multiple levels)
  // This regex removes templates iteratively until no more are found
  let previousText = '';
  while (previousText !== text) {
    previousText = text;
    text = text.replace(/\{\{[^{}]*\}\}/g, '');
  }

  // Remove wiki links [[link|text]] or [[link]]
  // Extract display text if present, otherwise use link text
  text = text.replace(/\[\[([^\]|]*\|)?([^\]]+)\]\]/g, (_, __, displayText) => {
    return displayText || '';
  });

  // Remove external links [url text] or [url]
  text = text.replace(/\[https?:\/\/[^\s\]]+([^\]]*)\]/g, (_, displayText) => {
    return displayText || '';
  });

  // Remove HTML tags (both opening and closing, including self-closing)
  text = text.replace(/<\/?[^>]+(>|$)/g, '');

  // Remove wiki formatting
  text = text.replace(/'''(.+?)'''/g, '$1'); // Bold
  text = text.replace(/''(.+?)''/g, '$1');   // Italic
  text = text.replace(/__(.+?)__/g, '$1');   // Underline

  // Remove comments <!-- ... -->
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Remove category links [[Category:...]]
  text = text.replace(/\[\[Category:[^\]]+\]\]/gi, '');

  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}