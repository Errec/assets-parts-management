import { getAssetsSchema } from '../schemas';
import { fetchData } from '../utils/fetchData';

export const fetchCompanyAssets = (companyId: string) => 
  fetchData({ endpoint: `/companies/${companyId}/assets`, schema: getAssetsSchema });