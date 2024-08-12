import React from 'react';
import arrowIcon from '../../assets/icons/arrow.svg';
import { getTreeIcons } from '../../utils/getTreeIcons';

type TreeNodeProps = {
  name: string;
  type: 'location' | 'asset' | 'component';
  onClick: () => void;
  hasChildren: boolean;
  isOpen: boolean;
  level: number;
  isSelected: boolean;
  status?: string | null;
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
  const { iconSrc, statusIconSrc, statusIconSize } = getTreeIcons(type, isSelected, status);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center ${isSelected ? 'bg-tractian-blue-200 text-white' : ''}`}
      style={{ paddingLeft: `${level * 20 + 2}px` }}
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

export default TreeNode;
