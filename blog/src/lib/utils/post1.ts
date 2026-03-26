import { generateBulkInsertSql, type CreatePostInput } from './createPost';

// Define multiple posts
const posts: CreatePostInput[] = [
  {
    hub: 'tiu',
    slug: 'first-post',
    keyword: 'keyword1',
    intent: 'practice',
    title: 'First Post Title',
    metaDescription: 'Description for first post...',
    h1: 'First Post H1',
    contentBlocks: [
      { type: 'paragraph', text: 'Content for first post...' }
    ]
  },
  {
    hub: 'tiu',
    slug: 'second-post',
    keyword: 'keyword2',
    intent: 'definition',
    title: 'Second Post Title',
    metaDescription: 'Description for second post...',
    h1: 'Second Post H1',
    contentBlocks: [
      { type: 'paragraph', text: 'Content for second post...' }
    ]
  }
  // Add more posts...
];

// Generate bulk SQL
const bulkSql = generateBulkInsertSql(posts);
console.log(bulkSql);