import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { TreeViewProps } from '../../types';
import { flattenSearchResults } from '../../utils/flattenSearchResults';
import { flattenTree } from '../../utils/flattenTree';
import { toggleFolder } from '../../utils/toggleFolder';
import TreeViewRow from '../ui/TreeViewRow';

const TreeLoading = lazy(() => import('../ui/TreeLoading'));

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

  const containerHeight = 580;
  const itemHeight = 30;

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
        searchResults.length > 0 ? flattenSearchResults({
          searchResults, 
          assetsByCompany, 
          locationsByCompany, 
          selectedCompanyId, 
          openFolders, 
          expandAll, 
          filterOperating, 
          filterCritical 
        }) : flattenTree({
          assetsByCompany, 
          locationsByCompany, 
          selectedCompanyId, 
          openFolders, 
          expandAll, 
          filterOperating, 
          filterCritical 
        });
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

  const handleToggleFolder = useCallback((id: string) => {
    toggleFolder(id, setOpenFolders);
  }, []);

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
      {({ index, style }) => (
        <TreeViewRow
          style={style}
          index={index}
          flattenedTree={flattenedTree}
          openFolders={openFolders}
          onAssetSelect={onAssetSelect}
          toggleFolder={handleToggleFolder}
          selectedAsset={selectedAsset}
        />
      )}
    </List>
  );
};

export default TreeView;
