import { z } from 'zod';

export const getCompaniesSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
}));

export const getLocationsSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
}));

export const getAssetsSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  locationId: z.string().nullable(),
  sensorType: z.string().nullable(),
  status: z.string().nullable(),
}));
