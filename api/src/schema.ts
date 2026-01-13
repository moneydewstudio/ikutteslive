import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email'),
  name: text('name'),
  isPremium: boolean('is_premium').default(false).notNull(),
  premiumUntil: timestamp('premium_until'),
  streak: integer('streak').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questionCategories = pgTable('question_categories', {
  id: integer('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
});

export const questionSubcategories = pgTable('question_subcategories', {
  id: integer('id').primaryKey(),
  categoryId: integer('category_id').references(() => questionCategories.id).notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
});

export const questions = pgTable('questions', {
  id: integer('id').primaryKey(),
  topicId: integer('topic_id').notNull(),
  subtopicId: integer('subtopic_id').notNull(),
  questionText: text('question_text').notNull(),
  code: text('code'),
  categoryId: integer('category_id').references(() => questionCategories.id),
  subcategoryId: integer('subcategory_id').references(() => questionSubcategories.id),
  difficulty: integer('difficulty').notNull(),
  stem: text('stem'),
  questionType: text('question_type').notNull(),
  timeLimitSeconds: integer('time_limit_seconds'),
  source: text('source'),
  yearTag: integer('year_tag'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const questionOptions = pgTable('question_options', {
  id: integer('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  optionKey: text('option_key').notNull(),
  optionText: text('option_text').notNull(),
  weight: integer('weight'),
  isCorrect: boolean('is_correct'),
});

export const questionExplanations = pgTable('question_explanations', {
  id: integer('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  tier: integer('tier').notNull(),
  content: text('content').notNull(),
});

export const attempts = pgTable('attempts', {
  id: integer('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  selectedOptionId: text('selected_option_id').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
