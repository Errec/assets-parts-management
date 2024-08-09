import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchCompanyAssetsData, fetchCompanyLocationsData } from '../api/companies';
import { useAssetStore } from '../store';
import { Asset } from '../types/asset';
import { Location } from '../types/location';

export const useFetchCompanies = () => {
  return useQuery<Asset[], unknown>('companies', fetchCompanyAssetsData, {
    onError: (error) => {
      console.error('Error fetching companies:', error);
    }
  });
};

export const useFetchCompanyLocations = (companyId: string) => {
  const setLocations = useAssetStore((state) => state.setLocations);

  const fetchLocations = useCallback(() => fetchCompanyLocationsData(), []);
  const { data: locations, ...rest } = useQuery<Location[], unknown>(
    ['locations', companyId],
    fetchLocations,
    {
      onError: (error) => {
        console.error('Error fetching locations:', error);
      }
    }
  );

  useEffect(() => {
    if (locations) {
      setLocations(locations);
    }
  }, [locations, setLocations]);

  return { data: locations, ...rest };
};

export const useFetchCompanyAssets = (companyId: string) => {
  const setAssets = useAssetStore((state) => state.setAssets);

  const fetchAssets = useCallback(() => fetchCompanyAssetsData(), []);
  const { data: assets, ...rest } = useQuery<Asset[], unknown>(
    ['assets', companyId],
    fetchAssets,
    {
      onError: (error) => {
        console.error('Error fetching assets:', error);
      }
    }
  );

  useEffect(() => {
    if (assets) {
      setAssets(assets);
    }
  }, [assets, setAssets]);

  return { data: assets, ...rest };
};
