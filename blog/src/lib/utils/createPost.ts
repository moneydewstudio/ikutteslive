// TEAM_017: helper to construct a programmatic page record for insertion
import type { ContentBlock, ProgrammaticIntent } from '../blogContent';

export type CreatePostInput = {
  hub: 'tiu' | 'twk' | 'tkp';
  slug: string;
  keyword: string;
  intent: ProgrammaticIntent;
  title: string;
  metaDescription: string;
  h1: string;
  contentBlocks: ContentBlock[];
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateInsertSql = (input: CreatePostInput): string => {
  const now = new Date().toISOString();
  const json = JSON.stringify(input.contentBlocks);
  const safeJson = json.replace(/'/g, "''");
  return `
INSERT INTO programmatic_pages (
  id,
  hub,
  slug,
  keyword,
  intent,
  title,
  meta_description,
  h1,
  content_blocks,
  updated_at
) VALUES (
  gen_random_uuid(),
  '${input.hub}',
  '${input.slug}',
  '${input.keyword}',
  '${input.intent}',
  '${input.title.replace(/'/g, "''")}',
  '${input.metaDescription.replace(/'/g, "''")}',
  '${input.h1.replace(/'/g, "''")}',
  '${safeJson}'::json,
  '${now}'
);
`;
};

// Generate bulk SQL INSERT statement for multiple posts
export const generateBulkInsertSql = (posts: CreatePostInput[]): string => {
  const now = new Date().toISOString();
  const values = posts.map(post => {
    const json = JSON.stringify(post.contentBlocks);
    const safeJson = json.replace(/'/g, "''");
    return `(
  gen_random_uuid(),
  '${post.hub}',
  '${post.slug}',
  '${post.keyword}',
  '${post.intent}',
  '${post.title.replace(/'/g, "''")}',
  '${post.metaDescription.replace(/'/g, "''")}',
  '${post.h1.replace(/'/g, "''")}',
  '${safeJson}'::json,
  '${now}'
)`;
  }).join(',\n');

  return `
INSERT INTO programmatic_pages (
  id,
  hub,
  slug,
  keyword,
  intent,
  title,
  meta_description,
  h1,
  content_blocks,
  updated_at
) VALUES
${values};
`;
};

// Helper to fetch random questions from API and add them as crawlable content blocks
export type QuestionFilter = {
  category?: 'TIU' | 'TWK' | 'TKP';
  subcategory?: string;
  difficulty?: number; // 1-5
};

export const addRandomQuestionsAsContent = async (
  posts: CreatePostInput[],
  questionsPerPost: number = 2,
  apiUrl: string = 'https://ikuttes.robimaulanaspsi.workers.dev',
  filter?: QuestionFilter
): Promise<CreatePostInput[]> => {
  // Map hub to question category
  const hubToCategory: Record<string, 'TIU' | 'TWK' | 'TKP'> = {
    'tiu': 'TIU',
    'twk': 'TWK',
    'tkp': 'TKP'
  };

  const updatedPosts = await Promise.all(posts.map(async (post) => {
    // Use provided filter, or fall back to hub-based category
    const category = filter?.category ?? hubToCategory[post.hub];
    if (!category) return post; // Skip if no matching category

    try {
      // Build query params
      const params = new URLSearchParams();
      params.set('limit', String(questionsPerPost));
      params.set('category', category);
      if (filter?.subcategory) params.set('subcategory', filter.subcategory);
      if (filter?.difficulty) params.set('difficulty', String(filter.difficulty));

      // Fetch random questions
      const response = await fetch(`${apiUrl}/questions/random?${params.toString()}`);
      if (!response.ok) return post; // Skip if API fails

      const questions = await response.json() as Array<{
        id: string;
        subject: string;
        difficulty: number;
        text: string;
        options: Array<{ id: string; text: string }>;
        correct_option_id: string;
        explanation: string;
        image_url?: string;
      }>;

      // Convert questions to crawlable content blocks
      const questionBlocks = questions.flatMap((question, qIdx) => {
        const blocks: ContentBlock[] = [
          {
            type: 'heading',
            level: 3,
            text: `Pertanyaan ${category} #${qIdx + 1} (Difficulty: ${question.difficulty}/5)`
          },
          {
            type: 'paragraph',
            text: question.text
          }
        ];

        // Add options as a list (A-E)
        if (question.options && question.options.length > 0) {
          const optionLabels = ['A', 'B', 'C', 'D', 'E'];
          const optionTexts = question.options.map((opt, idx) => {
            const label = optionLabels[idx] ?? String.fromCharCode(65 + idx);
            return `${label}. ${opt.text}`;
          });
          blocks.push({
            type: 'list',
            ordered: true,
            items: optionTexts
          });
        }

        // Add explanation if available
        if (question.explanation) {
          blocks.push({
            type: 'paragraph',
            text: `**Jawaban dan Penjelasan:** ${question.explanation}`
          });
        }

        return blocks;
      });

      // Insert question blocks after the first paragraph
      const newBlocks = [...post.contentBlocks];
      const insertIndex = Math.min(1, newBlocks.length);
      newBlocks.splice(insertIndex, 0, ...questionBlocks);

      return {
        ...post,
        contentBlocks: newBlocks
      };

    } catch (error) {
      console.error(`Failed to fetch questions for post ${post.slug}:`, error);
      return post; // Return original post if fetch fails
    }
  }));

  return updatedPosts;
};
