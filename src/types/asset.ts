import { z } from 'zod';

export type Asset = {
  id: string;
  name: string;
  parentId?: string | null;
  sensorId?: string | null;
  sensorType?: 'energy' | 'vibration' | null;
  status?: 'operating' | 'alert' | null;
  gatewayId?: string | null;
  locationId?: string | null;
};

export const assetSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable().optional(),
  sensorId: z.string().nullable().optional(),
  sensorType: z.enum(['energy', 'vibration']).nullable().optional(),
  status: z.enum(['operating', 'alert']).nullable().optional(),
  gatewayId: z.string().nullable().optional(),
  locationId: z.string().nullable().optional(),
});
