import { create } from 'zustand';
import { Location } from '../types/location';

interface LocationState {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  setLocations: (locations) => set((state) => ({ ...state, locations })),
}));
