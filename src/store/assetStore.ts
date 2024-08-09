import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompaniesData, fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset, assetSchema } from '../types/asset';
import { Location, locationSchema } from '../types/location';

export type AssetState = {
  assets: Asset[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchAndStoreData: () => Promise<void>;
  setAssets: (assets: Asset[]) => void;
  setLocations: (locations: Location[]) => void;
};

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  locations: [],
  loading: true,
  error: null,
  fetchAndStoreData: async () => {
    try {
      const companies = await fetchCompaniesData() as { id: string }[];
      let allLocations: Location[] = [];
      let allAssets: Asset[] = [];

      for (const company of companies) {
        const locations = await fetchCompanyLocationsData(company.id) as Location[];
        const assets = await fetchCompanyAssetsData(company.id) as Asset[];

        // Validate data using Zod schemas
        const validatedLocations = locations.map(location => locationSchema.parse(location));
        const validatedAssets = assets.map(asset => assetSchema.parse(asset));

        allLocations = [...allLocations, ...validatedLocations];
        allAssets = [...allAssets, ...validatedAssets];
      }

      set({ assets: allAssets, locations: allLocations, loading: false, error: null });
    } catch (error) {
      if (error instanceof z.ZodError) {
        set({ loading: false, error: `Validation error: ${error.errors.map(e => e.message).join(', ')}` });
      } else {
        set({ loading: false, error: 'Failed to fetch data' });
      }
    }
  },
  setAssets: (assets) => set({ assets }),
  setLocations: (locations) => set({ locations }),
}));
