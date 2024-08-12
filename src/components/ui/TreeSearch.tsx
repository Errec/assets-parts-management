import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { Asset, Location } from '../../types';

import assetIconB from '../../assets/icons/asset-b.svg';
import componentIconB from '../../assets/icons/component-b.png';
import locationIconB from '../../assets/icons/location-b.svg';
import searchIcon from '../../assets/icons/search.svg';

type TreeSearchProps = {
  selectedCompanyId: string | null;
  onSearch: (results: (Asset | Location)[], expandAll: boolean) => void;
};

const TreeSearch: React.FC<TreeSearchProps> = ({ selectedCompanyId, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewResults, setPreviewResults] = useState<(Asset | Location)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { assetsByCompany } = useAssetStore();
  const { locationsByCompany } = useLocationStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      onSearch([], false);
    } else if (selectedIndex >= 0 && previewResults[selectedIndex]) {
      onSearch([previewResults[selectedIndex]], false);
    } else {
      onSearch(previewResults, false);
    }
    setSearchTerm('');
    setPreviewResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % previewResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + previewResults.length) % previewResults.length);
    } else if (e.key === 'Escape') {
      setSearchTerm('');
      setPreviewResults([]);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setSearchTerm('');
      setPreviewResults([]);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const getIcon = (item: Asset | Location) => {
    if (item.hasOwnProperty('sensorType')) {
      return componentIconB;
    } else if (item.hasOwnProperty('parentId')) {
      return assetIconB;
    } else {
      return locationIconB;
    }
  };

  return (
    <div className="mb-4 relative" ref={searchContainerRef}>
      <div className="flex items-center relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search assets, components, or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 pl-3 pr-10 border border-tractian-gray-50 rounded"
        />
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="absolute right-2 w-6 h-6 flex items-center justify-center bg-transparent border-none cursor-pointer"
        >
          <img src={searchIcon} alt="Search" className="w-4 h-4" />
        </button>
      </div>
      {previewResults.length > 0 && searchTerm.length >= 3 && (
        <div 
          ref={previewRef}
          className="absolute z-10 w-full mt-1 bg-white border border-tractian-gray-50 rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {previewResults.map((item, index) => (
            <div
              key={item.id}
              className={`p-2 hover:bg-tractian-gray-50 cursor-pointer flex items-center ${index === selectedIndex ? 'bg-tractian-gray-50' : ''}`}
              onClick={() => {
                onSearch([item], false);
                setSearchTerm('');
                setPreviewResults([]);
              }}
            >
              <img src={getIcon(item)} alt="icon" className="mr-2 w-4 h-4" />
              {item.name}
            </div>
          ))}
        </div>
      )}
      {searchTerm.length >= 3 && previewResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-tractian-gray-50 rounded shadow-lg p-2">
          No results found
        </div>
      )}
    </div>
  );
};

export default TreeSearch;
