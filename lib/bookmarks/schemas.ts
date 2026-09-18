import { z } from 'zod';

const haystackSchema = z.object({
  raw: z.string(),
  full: z.string(),
  initials: z.string(),
});

export const bookmarkNodeSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  title: z.string(),
  url: z.string().optional(),
  isFolder: z.boolean(),
  dateAdded: z.number().optional(),
  dateLastUsed: z.number().optional(),
  folderType: z.enum(['bookmarks-bar', 'other', 'mobile', 'managed']).optional(),
  unmodifiable: z.literal('managed').optional(),
  syncing: z.boolean().optional(),
  path: z.array(z.string()),
  ancestorIds: z.array(z.string()),
});

export const searchIndexEntrySchema = z.object({
  id: z.string(),
  title: haystackSchema,
  domain: haystackSchema,
  path: haystackSchema,
  url: z.string(),
  ancestorIds: z.array(z.string()),
  isFolder: z.boolean(),
  unmodifiable: z.literal('managed').optional(),
  openCount: z.number(),
  lastOpenedAt: z.number().nullable(),
  dateAdded: z.number(),
});

export const openRecordSchema = z.object({
  bookmarkId: z.string(),
  openedAt: z.number(),
  openCount: z.number(),
});

export const bookmarkSnapshotSchema = z.object({
  version: z.literal(1),
  builtAt: z.number(),
  nodes: z.array(bookmarkNodeSchema),
  index: z.array(searchIndexEntrySchema),
});
