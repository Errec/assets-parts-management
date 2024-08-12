import { Asset, Location } from '../types';

export type TreeViewProps = {
  selectedCompanyId: string | null;
  searchResults: (Asset | Location)[];
  expandAll: boolean;
  filterOperating: boolean;
  filterCritical: boolean;
  selectedAsset: Asset | Location | null;
  onAssetSelect: (asset: Asset | Location) => void;
};