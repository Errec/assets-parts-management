import { z } from 'zod';

export type Location = {
  id: string;
  name: string;
  parentId?: string | null;
};

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable().optional(),
});