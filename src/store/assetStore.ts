import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset, assetSchema } from '../types/asset';
import { Location, locationSchema } from '../types/location';

export type AssetState = {
  assetsByCompany: { [companyId: string]: Asset[] };
  locationsByCompany: { [companyId: string]: Location[] };
  loading: boolean;
  error: string | null;
  fetchAssetsAndLocations: (companyId: string) => Promise<void>;
  setAssets: (companyId: string, assets: Asset[]) => void;
  setLocations: (companyId: string, locations: Location[]) => void;
};

export const useAssetStore = create<AssetState>((set, get) => ({
  assetsByCompany: {},
  locationsByCompany: {},
  loading: false,
  error: null,

  fetchAssetsAndLocations: async (companyId: string) => {
    if (get().assetsByCompany[companyId] && get().locationsByCompany[companyId]) {
      return; // Data already exists, no need to fetch again
    }

    set({ loading: true, error: null });

    try {
      const assets = await fetchCompanyAssetsData(companyId) as Asset[];
      const locations = await fetchCompanyLocationsData(companyId) as Location[];

      const validatedAssets = assets.map(asset => assetSchema.parse(asset));
      const validatedLocations = locations.map(location => locationSchema.parse(location));

      set((state) => ({
        assetsByCompany: { ...state.assetsByCompany, [companyId]: validatedAssets },
        locationsByCompany: { ...state.locationsByCompany, [companyId]: validatedLocations },
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch data' });
    }
  },

  setAssets: (companyId, assets) => {
    set((state) => ({
      assetsByCompany: { ...state.assetsByCompany, [companyId]: assets }
    }));
  },

  setLocations: (companyId, locations) => {
    set((state) => ({
      locationsByCompany: { ...state.locationsByCompany, [companyId]: locations }
    }));
  },
}));
