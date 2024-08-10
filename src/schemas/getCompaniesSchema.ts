import { z } from 'zod';

export const getCompaniesSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
);
