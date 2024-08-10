import { z } from 'zod';

export const getLocationsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().nullable(),
  })
);
