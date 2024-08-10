import { z } from 'zod';
import { create } from 'zustand';
import { fetchCompanyLocationsData } from '../services/apiService';
import { Location, locationSchema } from '../types/location';

export type LocationState = {
  locationsByCompany: { [companyId: string]: Location[] };
  loading: boolean;
  error: string | null;
  fetchLocations: (companyId: string) => Promise<void>;
  setLocations: (companyId: string, locations: Location[]) => void;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  locationsByCompany: {},
  loading: false,
  error: null,

  fetchLocations: async (companyId: string) => {
    if (get().locationsByCompany[companyId]) {
      return; // Data already exists, no need to fetch again
    }

    set({ loading: true, error: null });

    try {
      const locationsData = await fetchCompanyLocationsData(companyId);
      const validatedLocations = z.array(locationSchema).parse(locationsData); // Validate the array of locations

      set((state) => ({
        locationsByCompany: { ...state.locationsByCompany, [companyId]: validatedLocations },
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch locations' });
    }
  },

  setLocations: (companyId, locations) => {
    const validatedLocations = z.array(locationSchema).parse(locations); // Validate the array of locations
    set((state) => ({
      locationsByCompany: { ...state.locationsByCompany, [companyId]: validatedLocations }
    }));
  },
}));
