import { fetch as tauriFetch } from '@tauri-apps/api/http';
import { z } from 'zod';
import { handleError } from './errorHandler';

const API_BASE_URL = 'https://fake-api.tractian.com';

type FetchOptions = {
  endpoint: string;
  schema: z.ZodSchema<any>;
};

export const fetchData = async <T>({ endpoint, schema }: FetchOptions): Promise<T> => {
  try {
    const response = await tauriFetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.data;

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data received from the API');
    }

    try {
      return schema.parse(data);
    } catch (parseError) {
      console.error('Schema validation error:', parseError);
      throw new Error('Data validation failed');
    }
  } catch (error) {
    handleError(error);
    throw error;
  }
};