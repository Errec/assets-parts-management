import { Asset, Location } from '../types';

export const flattenTree = ({
  assetsByCompany,
  locationsByCompany,
  selectedCompanyId,
  openFolders,
  expandAll,
  filterOperating,
  filterCritical,
}: {
  assetsByCompany: any;
  locationsByCompany: any;
  selectedCompanyId: string | null;
  openFolders: { [key: string]: boolean };
  expandAll: boolean;
  filterOperating: boolean;
  filterCritical: boolean;
}): any[] => {
  if (!selectedCompanyId) return [];

  const locations: Location[] = locationsByCompany[selectedCompanyId] || [];
  const assets: Asset[] = assetsByCompany[selectedCompanyId] || [];
  const flattened: any[] = [];

  const addAsset = (asset: Asset, level: number) => {
    if (
      (filterOperating && asset.status !== 'operating' && asset.status !== null) ||
      (filterCritical && asset.status !== 'alert' && asset.status !== null)
    ) {
      return;
    }

    const type = asset.sensorType ? 'component' : 'asset';
    flattened.push({ ...asset, level, type });
    if (openFolders[asset.id] || expandAll) {
      assets
        .filter((subAsset: Asset) => subAsset.parentId === asset.id)
        .forEach((subAsset: Asset) => addAsset(subAsset, level + 1));
    }
  };

  const traverse = (locationId: string | null = null, level = 0, depth = 0) => {
    if (depth > 100) {
      console.warn(`Max recursion depth reached for locationId: ${locationId}`);
      return;
    }
    locations
      .filter((location: Location) => location.parentId === locationId)
      .forEach((location: Location) => {
        flattened.push({ ...location, level, type: 'location' });
        if (openFolders[location.id] || expandAll) {
          traverse(location.id, level + 1, depth + 1);
          assets
            .filter(
              (asset: Asset) =>
                asset.locationId === location.id && !asset.parentId
            )
            .forEach((asset: Asset) => addAsset(asset, level + 1));
        }
      });
  };

  traverse();

  assets
    .filter((asset: Asset) => !asset.locationId && !asset.parentId)
    .forEach((asset: Asset) => addAsset(asset, 0));

  return flattened;
};
