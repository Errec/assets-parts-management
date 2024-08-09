import { z } from 'zod';

export const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
  sensorId: z.string().nullable(),
  sensorType: z.enum(['energy', 'vibration']).nullable(),
  status: z.enum(['operating', 'alert']).nullable(),
  gatewayId: z.string().nullable(),
  locationId: z.string().nullable(),
});

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
});
