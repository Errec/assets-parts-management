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
  sensorType?: string;
  status?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, type, isOpen, onClick, hasChildren, level, sensorType, status }) => {
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
    if (status === 'operating') return <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>;
    if (status === 'alert') return <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>;
    return null;
  };

  return (
    <div onClick={onClick} className="cursor-pointer flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
      {getStatusDot()}
      <span>{getIcon()}</span>
      <span className="ml-2">{name}</span>
      {type === 'component' && sensorType && <span className="ml-2 text-xs text-gray-500">({sensorType})</span>}
    </div>
  );
};

type TreeViewProps = {
  selectedCompanyId: string | null;
  searchResults: (Asset | Location)[];
  expandAll: boolean;
}

const TreeView: React.FC<TreeViewProps> = ({ selectedCompanyId, searchResults, expandAll }) => {
  const { assetsByCompany, fetchAssets, filterOperating, filterCritical } = useAssetStore();
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
    if (selectedCompanyId && assetsByCompany[selectedCompanyId] && locationsByCompany[selectedCompanyId]) {
      const flattened = searchResults.length > 0 ? flattenSearchResults() : flattenTree();
      setFlattenedTree(flattened);
    }
  }, [assetsByCompany, locationsByCompany, selectedCompanyId, openFolders, filterOperating, filterCritical, searchResults]);

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
      ) return;

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
              .filter((asset: Asset) => asset.locationId === location.id && !asset.parentId)
              .forEach((asset: Asset) => addAsset(asset, level + 1));
            traverse(location.id, level + 1);
          }
        });
    };

    traverse();

    // Add unlinked assets and components
    assets
      .filter((asset: Asset) => !asset.locationId && !asset.parentId)
      .forEach((asset: Asset) => addAsset(asset, 0));

    return flattened;
  }, [assetsByCompany, locationsByCompany, selectedCompanyId, openFolders, filterOperating, filterCritical, expandAll]);

  const flattenSearchResults = useCallback(() => {
    const expandedResults: any[] = [];

    const addAssetToResults = (asset: Asset, level: number) => {
      const type = asset.sensorType ? 'component' : 'asset';
      expandedResults.push({ ...asset, level, type });
      if (expandAll || openFolders[asset.id]) {
        assetsByCompany[selectedCompanyId!]
          .filter((subAsset: Asset) => subAsset.parentId === asset.id)
          .forEach((subAsset: Asset) => addAssetToResults(subAsset, level + 1));
      }
    };

    const traverse = (locationId: string | null = null, level = 0) => {
      const locations: Location[] = locationsByCompany[selectedCompanyId!] || [];
      const assets: Asset[] = assetsByCompany[selectedCompanyId!] || [];
      locations
        .filter((location: Location) => location.parentId === locationId)
        .forEach((location: Location) => {
          expandedResults.push({ ...location, level, type: 'location' });
          if (openFolders[location.id] || expandAll) {
            assets
              .filter((asset: Asset) => asset.locationId === location.id && !asset.parentId)
              .forEach((asset: Asset) => addAssetToResults(asset, level + 1));
            traverse(location.id, level + 1);
          }
        });
    };

    searchResults.forEach(result => {
      if ('type' in result && result.type === 'location') {
        expandedResults.push({ ...result, level: 0, type: 'location' });
        traverse(result.id, 1);
      } else {
        addAssetToResults(result as Asset, 0);
      }
    });

    return expandedResults;
  }, [searchResults, assetsByCompany, locationsByCompany, selectedCompanyId, expandAll, openFolders]);

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
            onClick={() => toggleFolder(item.id)}
            hasChildren={hasChildren}
            level={item.level || 0}
            sensorType={item.sensorType}
            status={item.status}
          />
        </div>
      );
    },
    [flattenedTree, openFolders, toggleFolder]
  );

  if (!selectedCompanyId || !assetsByCompany[selectedCompanyId] || !locationsByCompany[selectedCompanyId]) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (flattenedTree.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No results found</div>;
  }

  return (
    <List height={580} itemCount={flattenedTree.length} itemSize={30} width="100%">
      {Row}
    </List>
  );
};

export default TreeView;
