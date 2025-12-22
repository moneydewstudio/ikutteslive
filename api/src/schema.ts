import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';

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
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code'),
  categoryId: integer('category_id').references(() => questionCategories.id),
  subcategoryId: integer('subcategory_id').references(() => questionSubcategories.id),
  difficulty: integer('difficulty').notNull(),
  stem: text('stem').notNull(),
  yearTag: integer('year_tag'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const questionOptions = pgTable('question_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  label: text('label').notNull(),
  text: text('text').notNull(),
  score: integer('score'),
  isCorrect: boolean('is_correct'),
});

export const questionExplanations = pgTable('question_explanations', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  tier: integer('tier').notNull(),
  content: text('content').notNull(),
});

export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  selectedOptionId: text('selected_option_id').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
