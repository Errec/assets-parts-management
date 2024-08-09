import { getLocationsSchema } from '../schemas';
import { fetchData } from '../utils/fetchData';

export const fetchCompanyLocations = (companyId: string) => 
  fetchData({ endpoint: `/companies/${companyId}/locations`, schema: getLocationsSchema });