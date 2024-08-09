import { create } from 'zustand';
import { fetchCompaniesData, fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset } from '../types/asset';
import { Location } from '../types/location';

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
  locations: [],  // Initialize with an empty array
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
        allLocations = [...allLocations, ...locations];
        allAssets = [...allAssets, ...assets];
      }

      set({ assets: allAssets, locations: allLocations, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch data' });
    }
  },
  setAssets: (assets) => set({ assets }),
  setLocations: (locations) => set({ locations }),
}));
