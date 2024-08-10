import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompaniesData, fetchCompanyAssetsData, fetchCompanyLocationsData } from '../services/apiService';
import { Asset } from '../types/asset';
import { Company, companySchema } from '../types/company';
import { Location } from '../types/location';

export type CompanyState = {
  companies: Company[];
  locations: Location[];
  assets: Asset[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  fetchCompanyData: (companyId: string) => Promise<void>;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  locations: [],
  assets: [],
  loading: true,
  error: null,
  fetchCompanies: async () => {
    try {
      const companies = await fetchCompaniesData() as Company[]; // Explicitly typing the API response
      const validatedCompanies = companies.map((company: Company) => companySchema.parse(company)); // Typing the 'company' parameter
      set({ companies: validatedCompanies, loading: false, error: null });
    } catch (error) {
      if (error instanceof z.ZodError) {
        set({ loading: false, error: `Validation error: ${error.errors.map(e => e.message).join(', ')}` });
      } else {
        set({ loading: false, error: (error as Error).message });
      }
    }
  },
  fetchCompanyData: async (companyId: string) => {
    set({ loading: true });
    try {
      const [locations, assets] = await Promise.all([
        fetchCompanyLocationsData(companyId),
        fetchCompanyAssetsData(companyId),
      ]);
      set({
        locations: locations as Location[],
        assets: assets as Asset[],
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
    }
  },
}));
