import { fetch as tauriFetch } from '@tauri-apps/api/http';
import { z } from 'zod';
import { getAssetsSchema, getCompaniesSchema, getLocationsSchema } from '../schemas';
import { handleError } from '../utils/errorHandler';

const API_BASE_URL = 'https://fake-api.tractian.com';

type FetchOptions = {
  endpoint: string;
  schema: z.ZodSchema<any>;
};

const fetchData = async <T>({ endpoint, schema }: FetchOptions): Promise<T> => {
  try {
    const response = await tauriFetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.data;

    // Check if data is undefined or not an array (for this specific case)
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data received from the API');
    }

    return schema.parse(data);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const fetchCompanies = () => fetchData({ endpoint: '/companies', schema: getCompaniesSchema });

export const fetchCompanyLocations = (companyId: string) => fetchData({ endpoint: `/companies/${companyId}/locations`, schema: getLocationsSchema });

export const fetchCompanyAssets = (companyId: string) => fetchData({ endpoint: `/companies/${companyId}/assets`, schema: getAssetsSchema });
