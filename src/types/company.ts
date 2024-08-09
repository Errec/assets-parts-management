import { z } from 'zod';

export type Company = {
  id: string;
  name: string;
};

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
});