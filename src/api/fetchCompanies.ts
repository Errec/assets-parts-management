import { getCompaniesSchema } from '../schemas';
import { fetchData } from '../utils/fetchData';

export const fetchCompanies = () => fetchData({ endpoint: '/companies', schema: getCompaniesSchema });