import { pgTable, text, timestamp, boolean, integer, char, serial } from 'drizzle-orm/pg-core';

// TEAM_001: align Drizzle schema with the actual Neon DB tables/columns to prevent 503 query failures

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
  topicId: integer('topic_id'),
  subtopicId: integer('subtopic_id'),
  questionText: text('question_text'),
  difficulty: integer('difficulty').notNull(),
  questionType: text('question_type'),
  timeLimitSeconds: integer('time_limit_seconds'),
  source: text('source'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),

  // legacy / future-proof columns present in DB
  code: text('code'),
  categoryId: integer('category_id').references(() => questionCategories.id),
  subcategoryId: integer('subcategory_id').references(() => questionSubcategories.id),
  stem: text('stem'),
  yearTag: integer('year_tag'),
});

export const questionOptions = pgTable('question_options', {
  id: integer('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  optionKey: char('option_key', { length: 1 }).notNull(),
  optionText: text('option_text').notNull(),
  weight: integer('weight'),
  isCorrect: boolean('is_correct'),
  createdAt: timestamp('created_at', { withTimezone: true }),
});

export const questionExplanations = pgTable('question_explanations', {
  id: integer('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  level: text('level').notNull(),
  explanationText: text('explanation_text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
});

// TEAM_009: persist tryout submissions for premium-gated history and subtopic radar analytics (tryout-only scope)

export const tryoutAttempts = pgTable('tryout_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  total: integer('total').notNull(),
  twk: integer('twk').notNull(),
  tiu: integer('tiu').notNull(),
  tkp: integer('tkp').notNull(),
  passed: boolean('passed'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const tryoutAttemptItems = pgTable('tryout_attempt_items', {
  id: serial('id').primaryKey(),
  attemptId: text('attempt_id').references(() => tryoutAttempts.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  categoryCode: text('category_code'),
  subcategoryId: integer('subcategory_id').references(() => questionSubcategories.id),
  isCorrect: boolean('is_correct'),
  selectedWeight: integer('selected_weight'),
  maxWeight: integer('max_weight'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
