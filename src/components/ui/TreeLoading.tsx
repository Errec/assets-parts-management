import React from 'react';

type TreeLoadingProps = {
  height: number; // Height of the container
  itemHeight: number; // Height of each loading item
};

const TreeLoading: React.FC<TreeLoadingProps> = ({ height, itemHeight }) => {
  const itemCount = Math.ceil(height / itemHeight); // Calculate the number of loading items based on the height

  return (
    <div className="flex flex-col space-y-2 p-4 w-full" style={{ height: `${height}px` }}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="w-full bg-gradient-to-r from-blue-200 to-blue-400 rounded animate-pulse"
          style={{ height: `${itemHeight}px` }}
        ></div>
      ))}
    </div>
  );
};

export default TreeLoading;
