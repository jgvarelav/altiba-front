import { BlocksContent } from '../models/producto.model';

/** Splits on blank lines so each paragraph in the textarea becomes its own block. */
export function textToBlocks(text: string): BlocksContent {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) {
    return [];
  }

  return paragraphs.map((paragraph) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: paragraph }],
  }));
}

export function blocksToText(blocks: BlocksContent | null | undefined): string {
  if (!blocks || blocks.length === 0) {
    return '';
  }

  return blocks
    .map((block) => block.children.map((child) => child.text ?? '').join(''))
    .join('\n\n');
}

/** Same as blocksToText but joined for compact single-line display (cards, previews). */
export function blocksToPlainText(blocks: BlocksContent | null | undefined): string {
  return blocksToText(blocks).replace(/\n+/g, ' ').trim();
}
