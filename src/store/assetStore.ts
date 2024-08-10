import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompanyAssetsData } from '../services/apiService';
import { Asset, assetSchema } from '../types/asset';

export type AssetState = {
  assetsByCompany: { [companyId: string]: Asset[] };
  loading: boolean;
  error: string | null;
  filterOperating: boolean; // New state for filtering operating sensors
  filterCritical: boolean;  // New state for filtering critical sensors
  fetchAssets: (companyId: string) => Promise<void>;
  setAssets: (companyId: string, assets: Asset[]) => void;
  toggleFilterOperating: () => void; // New action to toggle the operating filter
  toggleFilterCritical: () => void;  // New action to toggle the critical filter
};

export const useAssetStore = create<AssetState>((set, get) => ({
  assetsByCompany: {},
  loading: false,
  error: null,
  filterOperating: false, // Initialize filter state
  filterCritical: false,  // Initialize filter state

  fetchAssets: async (companyId: string) => {
    if (get().assetsByCompany[companyId]) {
      return; // Data already exists, no need to fetch again
    }

    set({ loading: true, error: null });

    try {
      const assetsData = await fetchCompanyAssetsData(companyId);
      const validatedAssets = z.array(assetSchema).parse(assetsData); // Validate the array of assets

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
    const validatedAssets = z.array(assetSchema).parse(assets); // Validate the array of assets
    set((state) => ({
      assetsByCompany: { ...state.assetsByCompany, [companyId]: validatedAssets }
    }));
  },

  // Action to toggle the operating filter
  toggleFilterOperating: () => set((state) => ({
    filterOperating: !state.filterOperating
  })),

  // Action to toggle the critical filter
  toggleFilterCritical: () => set((state) => ({
    filterCritical: !state.filterCritical
  })),
}));
