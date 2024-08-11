import { create } from 'zustand';
import { Asset, Location } from '../types';

type FlatSearchState = {
  flatResults: (Asset | Location)[];
  filterOperating: boolean;
  filterCritical: boolean;
  setFlatResults: (results: (Asset | Location)[]) => void;
  toggleFilterOperating: () => void;
  toggleFilterCritical: () => void;
}

export const useFlatSearchStore = create<FlatSearchState>((set) => ({
  flatResults: [],
  filterOperating: false,
  filterCritical: false,
  setFlatResults: (results) => set({ flatResults: results }),
  toggleFilterOperating: () =>
    set((state) => ({ filterOperating: !state.filterOperating })),
  toggleFilterCritical: () =>
    set((state) => ({ filterCritical: !state.filterCritical })),
}));
