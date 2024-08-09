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
  