import React, { useCallback, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { Asset, Location } from '../../types';

type TreeNodeProps = {
  name: string;
  type: 'location' | 'asset' | 'component';
  isOpen: boolean;
  onClick: () => void;
  hasChildren: boolean;
  level: number;
  isSelected: boolean;
  sensorType?: string;
  status?: string;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  type,
  isOpen,
  onClick,
  hasChildren,
  level,
  isSelected,
  sensorType,
  status,
}) => {
  const getIcon = () => {
    if (type === 'location') return isOpen ? '📂' : '📁';
    if (type === 'asset') return '🔧';
    if (type === 'component') {
      if (sensorType === 'vibration') return '📳';
      if (sensorType === 'energy') return '⚡';
      return '🔌';
    }
    return '•';
  };

  const getStatusDot = () => {
    if (status === 'operating')
      return <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>;
    if (status === 'alert')
      return <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>;
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center ${
        isSelected ? 'bg-blue-100' : ''
      }`}
      style={{ paddingLeft: `${level * 20}px` }}
    >
      {getStatusDot()}
      <span>{getIcon()}</span>
      <span className="ml-2">{name}</span>
      {type === 'component' && sensorType && (
        <span className="ml-2 text-xs text-gray-500">({sensorType})</span>
      )}
    </div>
  );
};

type TreeViewProps = {
  selectedCompanyId: string | null;
  searchResults: (Asset | Location)[];
  expandAll: boolean;
  filterOperating: boolean;
  filterCritical: boolean;
  selectedAsset: Asset | Location | null;
  onAssetSelect: (asset: Asset | Location) => void;
};

const TreeView: React.FC<TreeViewProps> = ({
  selectedCompanyId,
  searchResults,
  expandAll,
  filterOperating,
  filterCritical,
  selectedAsset,
  onAssetSelect,
}) => {
  const { assetsByCompany, fetchAssets } = useAssetStore();
  const { locationsByCompany, fetchLocations } = useLocationStore();
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});
  const [flattenedTree, setFlattenedTree] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchAssets(selectedCompanyId);
      fetchLocations(selectedCompanyId);
    }
  }, [selectedCompanyId, fetchAssets, fetchLocations]);

  useEffect(() => {
    if (
      selectedCompanyId &&
      assetsByCompany[selectedCompanyId] &&
      locationsByCompany[selectedCompanyId]
    ) {
      const flattened =
        searchResults.length > 0 ? flattenSearchResults() : flattenTree();
      setFlattenedTree(flattened);
    }
  }, [
    assetsByCompany,
    locationsByCompany,
    selectedCompanyId,
    openFolders,
    searchResults,
    expandAll,
    filterOperating,
    filterCritical,
  ]);

  const toggleFolder = useCallback((id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const flattenTree = useCallback(() => {
    if (!selectedCompanyId) return [];

    const locations: Location[] = locationsByCompany[selectedCompanyId] || [];
    const assets: Asset[] = assetsByCompany[selectedCompanyId] || [];
    const flattened: any[] = [];

    const addAsset = (asset: Asset, level: number) => {
      if (
        (filterOperating && asset.status !== 'operating') ||
        (filterCritical && asset.status !== 'alert')
      )
        return;

      const type = asset.sensorType ? 'component' : 'asset';
      flattened.push({ ...asset, level, type });
      if (openFolders[asset.id] || expandAll) {
        assets
          .filter((subAsset: Asset) => subAsset.parentId === asset.id)
          .forEach((subAsset: Asset) => addAsset(subAsset, level + 1));
      }
    };

    const traverse = (locationId: string | null = null, level = 0) => {
      locations
        .filter((location: Location) => location.parentId === locationId)
        .forEach((location: Location) => {
          flattened.push({ ...location, level, type: 'location' });
          if (openFolders[location.id] || expandAll) {
            assets
              .filter(
                (asset: Asset) =>
                  asset.locationId === location.id && !asset.parentId
              )
              .forEach((asset: Asset) => addAsset(asset, level + 1));
            traverse(location.id, level + 1);
          }
        });
    };

    traverse();

    assets
      .filter((asset: Asset) => !asset.locationId && !asset.parentId)
      .forEach((asset: Asset) => addAsset(asset, 0));

    return flattened;
  }, [
    assetsByCompany,
    locationsByCompany,
    selectedCompanyId,
    openFolders,
    expandAll,
    filterOperating,
    filterCritical,
  ]);

  const flattenSearchResults = useCallback(() => {
    const expandedResults: any[] = [];

    const addAssetAndChildren = (asset: Asset, level: number) => {
      if (
        (filterOperating && asset.status !== 'operating') ||
        (filterCritical && asset.status !== 'alert')
      )
        return;

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

    const traverse = (locationId: string, level: number) => {
      const locations: Location[] =
        locationsByCompany[selectedCompanyId!] || [];
      const assets: Asset[] = assetsByCompany[selectedCompanyId!] || [];

      const location = locations.find((loc) => loc.id === locationId);
      if (location) {
        expandedResults.push({ ...location, level, type: 'location' });
      }

      const isOpen = openFolders[locationId] || expandAll;

      assets
        .filter((asset: Asset) => asset.locationId === locationId && !asset.parentId)
        .forEach((asset: Asset) => {
          if (isOpen) {
            addAssetAndChildren(asset, level + 1);
          }
        });

      locations
        .filter((loc: Location) => loc.parentId === locationId)
        .forEach((loc: Location) => {
          if (isOpen) {
            traverse(loc.id, level + 1);
          }
        });
    };

    searchResults.forEach((result) => {
      if ('locationId' in result || 'parentId' in result) {
        expandedResults.push({ ...result, level: 0, type: result.sensorType ? 'component' : 'asset' });
        if ('parentId' in result) {
          traverse(result.id, 1);
        } else {
          addAssetAndChildren(result as Asset, 0);
        }
      } else {
        expandedResults.push({ ...result, level: 0, type: 'location' });
      }
    });

    return expandedResults;
  }, [
    searchResults,
    assetsByCompany,
    locationsByCompany,
    selectedCompanyId,
    filterOperating,
    filterCritical,
    openFolders,
    expandAll,
  ]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = flattenedTree[index];
      if (!item) return null;

      const hasChildren = item.type === 'location' || item.type === 'asset';

      return (
        <div style={style}>
          <TreeNode
            name={item.name}
            type={item.type || (item.sensorType ? 'component' : 'asset')}
            isOpen={!!openFolders[item.id]}
            onClick={() => {
              toggleFolder(item.id);
              onAssetSelect(item);
            }}
            hasChildren={hasChildren}
            level={item.level || 0}
            isSelected={selectedAsset ? selectedAsset.id === item.id : false}
            sensorType={item.sensorType}
            status={item.status}
          />
        </div>
      );
    },
    [
      flattenedTree,
      openFolders,
      toggleFolder,
      onAssetSelect,
      selectedAsset,
    ]
  );

  if (
    !selectedCompanyId ||
    !assetsByCompany[selectedCompanyId] ||
    !locationsByCompany[selectedCompanyId]
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (flattenedTree.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No results found
      </div>
    );
  }

  return (
    <List height={580} itemCount={flattenedTree.length} itemSize={30} width="100%">
      {Row}
    </List>
  );
};

export default TreeView;
