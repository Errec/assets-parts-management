import { useEffect } from 'react';
import { useAssetStore } from '../store/assetStore';
import { useLocationStore } from '../store/locationStore';

export const useFetchCompanyLocations = (companyId: string) => {
  const fetchLocations = useLocationStore((state) => state.fetchLocations);
  const locations = useLocationStore((state) => state.locationsByCompany[companyId]);

  useEffect(() => {
    if (!locations) {
      fetchLocations(companyId);
    }
  }, [companyId, fetchLocations, locations]);

  return locations;
};

export const useFetchCompanyAssets = (companyId: string) => {
  const fetchAssets = useAssetStore((state) => state.fetchAssets);
  const assets = useAssetStore((state) => state.assetsByCompany[companyId]);

  useEffect(() => {
    if (!assets) {
      fetchAssets(companyId);
    }
  }, [companyId, fetchAssets, assets]);

  return assets;
};
