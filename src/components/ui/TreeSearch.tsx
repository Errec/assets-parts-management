import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { Asset, Location } from '../../types';

interface TreeSearchProps {
  selectedCompanyId: string | null;
  onSearch: (results: (Asset | Location)[], expandAll: boolean) => void;
}

const TreeSearch: React.FC<TreeSearchProps> = ({ selectedCompanyId, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewResults, setPreviewResults] = useState<(Asset | Location)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { assetsByCompany } = useAssetStore();
  const { locationsByCompany } = useLocationStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLDivElement | null)[]>([]);

  const performSearch = useCallback((term: string) => {
    if (term.length >= 3 && selectedCompanyId) {
      const assets = assetsByCompany[selectedCompanyId] || [];
      const locations = locationsByCompany[selectedCompanyId] || [];

      const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(term.toLowerCase())
      );
      const filteredLocations = locations.filter(location =>
        location.name.toLowerCase().includes(term.toLowerCase())
      );

      const results = [...filteredAssets, ...filteredLocations];
      setPreviewResults(results);
      setSelectedIndex(-1);
    } else {
      setPreviewResults([]);
    }
  }, [selectedCompanyId, assetsByCompany, locationsByCompany]);

  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    setSearchTerm('');
    setPreviewResults([]);
  }, [selectedCompanyId]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim() === '') {
      // Return the original tree when search is empty
      onSearch([], false);
    } else if (selectedIndex !== -1) {
      onSearch([previewResults[selectedIndex]], false);
      setSearchTerm('');
      setPreviewResults([]);
    } else {
      onSearch(previewResults, false);
      setSearchTerm('');
      setPreviewResults([]);
    }
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => Math.min(prev + 1, previewResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    if (selectedIndex !== -1 && resultsRef.current[selectedIndex]) {
      resultsRef.current[selectedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedIndex]);

  const getIcon = (item: Asset | Location) => {
    if ('parentId' in item) return '📁';
    if ('sensorType' in item) {
      if (item.sensorType === 'vibration') return '📳';
      if (item.sensorType === 'energy') return '⚡';
      return '🔌';
    }
    return '🔧';
  };

  return (
    <div className="mb-4 relative">
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search assets, components, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button 
          onClick={handleSearchSubmit} 
          className="p-2 bg-blue-500 text-white rounded ml-2">
          🔍
        </button>
      </div>
      {previewResults.length > 0 && searchTerm.length >= 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {previewResults.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (resultsRef.current[index] = el)}
              className={`p-2 cursor-pointer flex items-center ${selectedIndex === index ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              onClick={() => {
                onSearch([item], false);
                setSearchTerm('');
                setPreviewResults([]);
              }}
            >
              <span className="mr-2">{getIcon(item)}</span>
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeSearch;
