// TEAM_010: shared blog content types and helpers

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'question_preview'; questionId: string }
  | { type: 'cta'; style: 'hard' | 'soft' };

export type ProgrammaticIntent = 'practice' | 'definition';

export type HubRecord = {
  slug: string;
  title: string;
  metaDescription: string | null;
  introduction: string | null;
};

export type ProgrammaticPageRecord = {
  id: string;
  hub: string;
  slug: string;
  keyword: string;
  intent: ProgrammaticIntent;
  title: string;
  metaDescription: string | null;
  h1: string;
  contentBlocks: ContentBlock[];
  updatedAt: Date | null;
};

export type FaqItem = {
  question: string;
  answer: string;
};

const CTA_BLOCK_TYPES = new Set(['cta']);

export const hasCtaBlock = (blocks: ContentBlock[]): boolean =>
  blocks.some((block) => CTA_BLOCK_TYPES.has(block.type));

export const injectCtaBlock = (
  blocks: ContentBlock[],
  intent: ProgrammaticIntent,
): ContentBlock[] => {
  if (hasCtaBlock(blocks)) {
    return blocks;
  }
  const insertIndex = intent === 'practice'
    ? Math.min(1, blocks.length)
    : Math.max(1, Math.floor(blocks.length / 2));
  const style = intent === 'practice' ? 'hard' : 'soft';
  const nextBlocks = [...blocks];
  nextBlocks.splice(insertIndex, 0, { type: 'cta', style });
  return nextBlocks;
};

export const getBlocksWordCount = (blocks: ContentBlock[]): number => {
  const text = blocks
    .map((block) => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        return block.text;
      }
      if (block.type === 'list') {
        return block.items.join(' ');
      }
      return '';
    })
    .join(' ');
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const extractFaqPairs = (blocks: ContentBlock[]): FaqItem[] => {
  const faqs: FaqItem[] = [];
  for (let i = 0; i < blocks.length - 1; i += 1) {
    const current = blocks[i];
    const next = blocks[i + 1];
    if (current.type !== 'paragraph' || next.type !== 'paragraph') {
      continue;
    }
    const questionMatch = current.text.match(/^Q:\s*(.+)$/i);
    const answerMatch = next.text.match(/^A:\s*(.+)$/i);
    if (questionMatch && answerMatch) {
      faqs.push({
        question: questionMatch[1].trim(),
        answer: answerMatch[1].trim(),
      });
      i += 1;
    }
  }
  return faqs;
};
