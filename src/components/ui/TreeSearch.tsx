import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { useLocationStore } from '../../store/locationStore';
import { Asset, Location } from '../../types';

interface TreeSearchProps {
  selectedCompanyId: string | null;
  onSearch: (results: (Asset | Location)[]) => void;
}

const TreeSearch: React.FC<TreeSearchProps> = ({ selectedCompanyId, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewResults, setPreviewResults] = useState<(Asset | Location)[]>([]);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(-1);
  const { assetsByCompany } = useAssetStore();
  const { locationsByCompany } = useLocationStore();
  const inputRef = useRef<HTMLInputElement>(null);

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
      onSearch(results);
    } else {
      setPreviewResults([]);
      onSearch([]);
    }
  }, [selectedCompanyId, assetsByCompany, locationsByCompany, onSearch]);

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
    setSelectedPreviewIndex(-1);
  }, [selectedCompanyId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedPreviewIndex(prev => Math.min(prev + 1, previewResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedPreviewIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedPreviewIndex !== -1) {
      onSearch([previewResults[selectedPreviewIndex]]);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="mb-4 relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search assets, components, or locations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {previewResults.length > 0 && searchTerm.length >= 3 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {previewResults.map((item, index) => (
            <div
              key={item.id}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${index === selectedPreviewIndex ? 'bg-blue-100' : ''}`}
              onClick={() => {
                onSearch([item]);
                setSearchTerm('');
                setPreviewResults([]);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
      {searchTerm.length >= 3 && previewResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-2">
          No results found
        </div>
      )}
    </div>
  );
};

export default TreeSearch;
