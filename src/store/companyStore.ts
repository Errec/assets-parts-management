import { create } from 'zustand';
import { fetchCompaniesData, fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset } from '../types/asset';
import { Location } from '../types/location';
import { useAssetStore } from './assetStore';
import { useLocationStore } from './locationStore';

interface CompanyState {
  loading: boolean;
  error: string | null;
  fetchAndStoreData: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  loading: true,
  error: null,
  fetchAndStoreData: async () => {
    try {
      const companies = await fetchCompaniesData() as { id: string }[];

      const { setAssets } = useAssetStore.getState();
      const { setLocations } = useLocationStore.getState();

      let allLocations: Location[] = [];  // Explicitly defining the type
      let allAssets: Asset[] = [];  // Explicitly defining the type

      for (const company of companies) {
        const locations = await fetchCompanyLocationsData(company.id) as Location[];
        const assets = await fetchCompanyAssetsData(company.id) as Asset[];

        allLocations = [...allLocations, ...locations];
        allAssets = [...allAssets, ...assets];
      }

      setAssets(allAssets);
      setLocations(allLocations);

      set(() => ({
        loading: false,
        error: null,
      }));
    } catch (error) {
      set(() => ({
        loading: false,
        error: 'Failed to fetch data',
      }));
    }
  },
}));
