import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { fetchCompanies, fetchCompanyAssets, fetchCompanyLocations } from '../api';

export const useFetchCompanies = () => {
  return useQuery('companies', fetchCompanies);
};

export const useFetchCompanyLocations = (companyId: string) => {
  const fetchLocations = useCallback(() => fetchCompanyLocations(companyId), [companyId]);
  return useQuery(['locations', companyId], fetchLocations);
};

export const useFetchCompanyAssets = (companyId: string) => {
  const fetchAssets = useCallback(() => fetchCompanyAssets(companyId), [companyId]);
  return useQuery(['assets', companyId], fetchAssets);
};
