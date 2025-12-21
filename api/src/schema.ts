import { pgTable, text, timestamp, boolean, integer, uuid, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email'),
  name: text('name'),
  isPremium: boolean('is_premium').default(false).notNull(),
  premiumUntil: timestamp('premium_until'),
  streak: integer('streak').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject: text('subject').notNull(),
  difficulty: integer('difficulty').notNull(),
  text: text('text').notNull(),
  explanation: text('explanation').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const options = pgTable('options', {
  id: text('id').notNull(), // 'a', 'b', 'c', etc.
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  text: text('text').notNull(),
  isCorrect: boolean('is_correct').default(false).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.id, table.questionId] }),
}));

export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  selectedOptionId: text('selected_option_id').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
