import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompanyAssetsData } from '../services/apiService';
import { Asset, assetSchema } from '../types/asset';

export type AssetState = {
  assetsByCompany: { [companyId: string]: Asset[] };
  searchResults: Asset[]; // Store the flattened search results here
  loading: boolean;
  error: string | null;
  filterOperating: boolean; // Filter state
  filterCritical: boolean;  // Filter state
  fetchAssets: (companyId: string) => Promise<void>;
  setAssets: (companyId: string, assets: Asset[]) => void;
  setSearchResults: (results: Asset[]) => void; // Update search results
  toggleFilterOperating: () => void;
  toggleFilterCritical: () => void;
};

export const useAssetStore = create<AssetState>((set, get) => ({
  assetsByCompany: {},
  searchResults: [], // Initialize as empty
  loading: false,
  error: null,
  filterOperating: false,
  filterCritical: false,

  fetchAssets: async (companyId: string) => {
    if (get().assetsByCompany[companyId]) {
      return; // Data already exists, no need to fetch again
    }

    set({ loading: true, error: null });

    try {
      const assetsData = await fetchCompanyAssetsData(companyId);
      const validatedAssets = z.array(assetSchema).parse(assetsData);

      set((state) => ({
        assetsByCompany: { ...state.assetsByCompany, [companyId]: validatedAssets },
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch assets' });
    }
  },

  setAssets: (companyId, assets) => {
    const validatedAssets = z.array(assetSchema).parse(assets);
    set((state) => ({
      assetsByCompany: { ...state.assetsByCompany, [companyId]: validatedAssets }
    }));
  },

  setSearchResults: (results) => {
    set({ searchResults: results });
  },

  toggleFilterOperating: () => set((state) => ({
    filterOperating: !state.filterOperating,
  })),

  toggleFilterCritical: () => set((state) => ({
    filterCritical: !state.filterCritical,
  })),
}));
