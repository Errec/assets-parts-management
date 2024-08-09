import { z } from 'zod';

export const getAssetsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().nullable().optional(),
    locationId: z.string().nullable().optional(),
    sensorId: z.string().nullable().optional(),
    sensorType: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    gatewayId: z.string().nullable().optional(),
  })
);