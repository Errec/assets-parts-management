import React from 'react';
import { isAsset } from '../../utils/isAsset';
import TreeNode from './TreeNode';

type TreeViewRowProps = {
  index: number;
  style: React.CSSProperties;
  flattenedTree: any[];
  openFolders: { [key: string]: boolean };
  onAssetSelect: (asset: any) => void;
  toggleFolder: (id: string) => void;
  selectedAsset: any;
};

const TreeViewRow: React.FC<TreeViewRowProps> = ({
  index,
  style,
  flattenedTree,
  openFolders,
  onAssetSelect,
  toggleFolder,
  selectedAsset,
}) => {
  const item = flattenedTree[index];
  if (!item) return null;

  const hasChildren = item.type === 'location' || item.type === 'asset';

  return (
    <div style={style}>
      <TreeNode
        name={item.name}
        type={item.type || ('sensorType' in item ? 'component' : 'asset')}
        onClick={() => {
          if (hasChildren) {
            toggleFolder(item.id);
          }
          onAssetSelect(item);
        }}
        hasChildren={hasChildren}
        isOpen={!!openFolders[item.id]}
        level={item.level || 0}
        isSelected={selectedAsset ? selectedAsset.id === item.id : false}
        status={isAsset(item) ? item.status : undefined}
      />
    </div>
  );
};

export default TreeViewRow;
