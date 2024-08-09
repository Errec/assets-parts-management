// assetState.ts
import { Asset, assetSchema } from './asset';
import { Location, locationSchema } from './location';

export type AssetState = {
  assets: Asset[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchAndStoreData: () => void;
  setAssets: (assets: Asset[]) => void;
  setLocations: (locations: Location[]) => void;
};

const validateAsset = (asset: Asset) => {
  return assetSchema.parse(asset);
};

const validateLocation = (location: Location) => {
  return locationSchema.parse(location);
};
