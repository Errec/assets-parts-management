import { z } from 'zod';
import { create } from 'zustand';
import { Location, locationSchema } from '../types/location';

export type LocationState = {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  setLocations: (locations) => {
    try {
      const validatedLocations = locations.map(location => locationSchema.parse(location));
      set({ locations: validatedLocations });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Failed to set locations:', error);
      }
    }
  },
}));
