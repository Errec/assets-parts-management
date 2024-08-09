import { create } from 'zustand';
import { fetchCompaniesData, fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset } from '../types/asset';
import { AssetState } from '../types/assetState';
import { Location } from '../types/location';

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

        allLocations = [...allLocations, ...locations];
        allAssets = [...allAssets, ...assets];
      }

      set((state) => ({
        ...state,
        assets: allAssets,
        locations: allLocations,
        loading: false,
        error: null,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        loading: false,
        error: 'Failed to fetch data',
      }));
    }
  },
  setAssets: (assets) => set((state) => ({ ...state, assets })),
  setLocations: (locations) => set((state) => ({ ...state, locations })),
}));
