import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompaniesData } from '../services/apiService';
import { Company, companySchema } from '../types/company';

export type CompanyState = {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
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
        set({ loading: false, error: 'Failed to fetch companies' });
      }
    }
  },
}));
