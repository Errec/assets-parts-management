import { Asset } from './asset';
import { Location } from './location';

export type AssetState = {
  assets: Asset[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchAndStoreData: () => void;
  setAssets: (assets: Asset[]) => void;
  setLocations: (locations: Location[]) => void;
};
