import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { Asset, Location } from '../../types';

import arrowIcon from '../../assets/icons/arrow.svg'; // Import the arrow icon
import assetIconB from '../../assets/icons/asset-b.svg';
import assetIconW from '../../assets/icons/asset-w.svg';
import componentIconB from '../../assets/icons/component-b.png';
import componentIconW from '../../assets/icons/component-w.png';
import locationIconB from '../../assets/icons/location-b.svg';
import locationIconW from '../../assets/icons/location-w.svg';
import alertAlertIcon from '../../assets/icons/status-alert.svg';
import alertOperationalIcon from '../../assets/icons/status-operational.svg';

const TreeLoading = lazy(() => import('../ui/TreeLoading'));

type TreeNodeProps = {
  name: string;
  type: 'location' | 'asset' | 'component';
  onClick: () => void;
  hasChildren: boolean;
  isOpen: boolean;
  level: number;
  isSelected: boolean;
  status?: string;
};

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  type,
  onClick,
  hasChildren,
  isOpen,
  level,
  isSelected,
  status,
}) => {
  const getIcon = () => {
    if (type === 'location') return isSelected ? locationIconW : locationIconB;
    if (type === 'asset') return isSelected ? assetIconW : assetIconB;
    if (type === 'component') return isSelected ? componentIconW : componentIconB;
    return undefined;
  };

  const getStatusIcon = () => {
    if (status === 'operating') return alertOperationalIcon;
    if (status === 'alert') return alertAlertIcon;
    return undefined;
  };

  const iconSrc = getIcon();
  const statusIconSrc = getStatusIcon();
  const statusIconSize = status === 'operating' ? 'w-3 h-3' : 'w-2 h-2'; // 12px for operational, 8px for alert

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center ${
        isSelected ? 'bg-tractian-blue-200 text-white' : ''
      }`}
      style={{ paddingLeft: `${level * 20 + 2}px` }} // Added extra 2px padding
    >
      {hasChildren && (
        <img
          src={arrowIcon}
          alt="arrow icon"
          className="mr-2 transition-transform"
          style={{
            width: '10px',
            height: '10px',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        />
      )}
      {iconSrc && <img src={iconSrc} alt={`${type} icon`} className="mr-2" />}
      <span className="mr-1.5 text-lg">{name}</span>
      {statusIconSrc && (
        <img src={statusIconSrc} alt={`${status} icon`} className={`${statusIconSize}`} />
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

  const containerHeight = 580; // Define the height of the container
  const itemHeight = 30; // Define the height of each item

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
        expandedResults.push({ ...result, level: 0, type: 'sensorType' in result ? 'component' : 'asset' });
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
            type={item.type || ('sensorType' in item ? 'component' : 'asset')}
            onClick={() => {
              toggleFolder(item.id);
              onAssetSelect(item);
            }}
            hasChildren={hasChildren}
            isOpen={!!openFolders[item.id]}
            level={item.level || 0}
            isSelected={selectedAsset ? selectedAsset.id === item.id : false}
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
      <Suspense fallback={<div>Loading...</div>}>
        <TreeLoading height={containerHeight} itemHeight={itemHeight} />
      </Suspense>
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
    <List height={containerHeight} itemCount={flattenedTree.length} itemSize={itemHeight} width="100%">
      {Row}
    </List>
  );
};

export default TreeView;
