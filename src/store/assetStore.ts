import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompanyAssetsData } from '../services/apiService';
import { Asset, assetSchema } from '../types/asset';

export type AssetState = {
  assetsByCompany: { [companyId: string]: Asset[] };
  loading: boolean;
  error: string | null;
  fetchAssets: (companyId: string) => Promise<void>;
  setAssets: (companyId: string, assets: Asset[]) => void;
};

export const useAssetStore = create<AssetState>((set, get) => ({
  assetsByCompany: {},
  loading: false,
  error: null,

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
}));
