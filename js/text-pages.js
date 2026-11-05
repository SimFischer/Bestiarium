// Presentation slices only. No whitespace, spelling or paragraph changes to stored text.
export function paginateText(text, paragraph, limit = Infinity) {
  const pages = [];
  let start = 0;
  while (start < text.length && pages.length < limit) {
    let low = 1, high = text.length - start, fits = 1;
    while (low <= high) {
      const length = Math.floor((low + high) / 2);
      paragraph.textContent = text.slice(start, start + length);
      if (paragraph.scrollHeight <= paragraph.clientHeight + 1) { fits = length; low = length + 1; }
      else high = length - 1;
    }
    let end = start + fits;
    if (end < text.length) {
      const slice = text.slice(start, end);
      const paragraphEnd = slice.lastIndexOf('\n\n');
      if (paragraphEnd > fits * .6) end = start + paragraphEnd + 2;
      else {
        const boundary = slice.search(/\s+\S*$/u);
        if (boundary > fits * .6) end = start + boundary + 1;
      }
      // Keep surrogate pairs together even with very long unbroken words.
      if (end > start + 1 && /[\uD800-\uDBFF]/.test(text[end - 1])) end--;
    }
    pages.push({ start, end, text: text.slice(start, end) }); start = end;
  }
  if (!pages.length) pages.push({ start: 0, end: 0, text: '' });
  return pages;
}
