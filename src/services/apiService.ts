import { QueryClient } from 'react-query';
import { fetchCompanies, fetchCompanyAssets, fetchCompanyLocations } from '../api';

export const queryClient = new QueryClient();

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const fetchCompaniesData = () => {
  return fetchCompanies();
};

export const fetchCompanyLocationsData = (companyId: string) => {
  return fetchCompanyLocations(companyId);
};

export const fetchCompanyAssetsData = (companyId: string) => {
  return fetchCompanyAssets(companyId);
};
