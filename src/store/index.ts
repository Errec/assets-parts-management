import create from 'zustand';

type State = {
  someState: string;
  setSomeState: (value: string) => void;
};

export const useStore = create<State>((set) => ({
  someState: '',
  setSomeState: (value: string) => set({ someState: value }),
}));
