import React, { useEffect, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { Asset, Location } from '../../types';

interface TreeNodeProps {
  name: string;
  isFolder: boolean;
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  hasChildren: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, isFolder, isOpen, onClick, children, hasChildren }) => {
  return (
    <div className="ml-4">
      <div onClick={onClick} className={`cursor-pointer flex items-center ${hasChildren ? '' : 'pl-5'}`}>
        {isFolder && hasChildren ? (
          isOpen ? (
            <span>&#9660;</span> // Arrow down
          ) : (
            <span>&#9654;</span> // Arrow right
          )
        ) : (
          <span>&#8226;</span> // Dot
        )}
        <span className="ml-2">{name}</span>
      </div>
      {isOpen && <div className="ml-4">{children}</div>}
    </div>
  );
};

interface TreeViewProps {
  companyId: string;
}

const TreeView: React.FC<TreeViewProps> = ({ companyId }) => {
  const { assetsByCompany, locationsByCompany, fetchAssetsAndLocations, loading } = useAssetStore();
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchAssetsAndLocations(companyId);
  }, [companyId, fetchAssetsAndLocations]);

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (locationId: string | null = null) => {
    const locations = locationsByCompany[companyId];
    const assets = assetsByCompany[companyId];

    return locations?.filter((location) => location.parentId === locationId).map((location) => {
      const childAssets = assets?.filter((asset) => asset.locationId === location.id && !asset.parentId);
      const hasChildren = childAssets?.length > 0 || locations?.some(l => l.parentId === location.id);

      return (
        <TreeNode
          key={location.id}
          name={location.name}
          isFolder={true}
          isOpen={!!openFolders[location.id]}
          onClick={() => toggleFolder(location.id)}
          hasChildren={hasChildren}
        >
          {childAssets?.map((asset) => (
            <TreeNode
              key={asset.id}
              name={asset.name}
              isFolder={assets.some(subAsset => subAsset.parentId === asset.id)}
              isOpen={!!openFolders[asset.id]}
              onClick={() => toggleFolder(asset.id)}
              hasChildren={assets.some(subAsset => subAsset.parentId === asset.id)}
            >
              {assets?.filter((subAsset) => subAsset.parentId === asset.id).map((subAsset) => (
                <TreeNode
                  key={subAsset.id}
                  name={subAsset.name}
                  isFolder={assets.some(component => component.parentId === subAsset.id)}
                  isOpen={!!openFolders[subAsset.id]}
                  onClick={() => toggleFolder(subAsset.id)}
                  hasChildren={assets.some(component => component.parentId === subAsset.id)}
                >
                  {assets?.filter((component) => component.parentId === subAsset.id).map((component) => (
                    <TreeNode
                      key={component.id}
                      name={component.name}
                      isFolder={false}
                      isOpen={false}
                      onClick={() => {}}
                      hasChildren={false}
                    />
                  ))}
                </TreeNode>
              ))}
            </TreeNode>
          ))}
          {renderTree(location.id)}
        </TreeNode>
      );
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <div>{renderTree()}</div>;
};

export default TreeView;
