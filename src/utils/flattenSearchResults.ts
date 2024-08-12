import { Asset, Location } from '../types';
import { isAsset } from './isAsset';

export const flattenSearchResults = ({
  searchResults,
  assetsByCompany,
  locationsByCompany,
  selectedCompanyId,
  openFolders,
  expandAll,
  filterOperating,
  filterCritical,
}: {
  searchResults: (Asset | Location)[];
  assetsByCompany: any;
  locationsByCompany: any;
  selectedCompanyId: string | null;
  openFolders: { [key: string]: boolean };
  expandAll: boolean;
  filterOperating: boolean;
  filterCritical: boolean;
}): any[] => {
  const expandedResults: any[] = [];

  const addAssetAndChildren = (asset: Asset, level: number) => {
    if (
      (filterOperating && asset.status !== 'operating' && asset.status !== null) ||
      (filterCritical && asset.status !== 'alert' && asset.status !== null)
    ) {
      return;
    }

    const type = asset.sensorType ? 'component' : 'asset';
    expandedResults.push({ ...asset, level, type });

    const isOpen = openFolders[asset.id] || expandAll;

    assetsByCompany[selectedCompanyId!]
      .filter((subAsset: Asset) => subAsset.parentId === asset.id)
      .forEach((subAsset: Asset) => {
        if (isOpen) {
          addAssetAndChildren(subAsset, level + 1);
        }
      });
  };

  const traverse = (locationId: string, level: number, depth = 0) => {
    if (depth > 100) {
      console.warn(`Max recursion depth reached for locationId: ${locationId}`);
      return;
    }
    const locations: Location[] = locationsByCompany[selectedCompanyId!] || [];
    const assets: Asset[] = assetsByCompany[selectedCompanyId!] || [];

    locations
      .filter((location) => location.parentId === locationId)
      .forEach((location) => {
        expandedResults.push({ ...location, level, type: 'location' });
        if (openFolders[location.id] || expandAll) {
          traverse(location.id, level + 1, depth + 1);
        }
      });

    assets
      .filter((asset) => asset.locationId === locationId && !asset.parentId)
      .forEach((asset) => {
        addAssetAndChildren(asset, level + 1);
      });
  };

  searchResults.forEach((result) => {
    if (isAsset(result)) {
      if (
        (filterOperating && result.status !== 'operating' && result.status !== null) ||
        (filterCritical && result.status !== 'alert' && result.status !== null)
      ) {
        return;
      }
      expandedResults.push({ ...result, level: 0, type: 'component' });
      addAssetAndChildren(result as Asset, 0);
    } else {
      expandedResults.push({ ...result, level: 0, type: 'location' });
      traverse(result.id, 1);
    }
  });

  return expandedResults;
};
