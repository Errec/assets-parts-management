import React, { useCallback, useEffect, useState } from 'react';
import { useCompanyStore } from '../../store';
import { Asset, Location } from '../../types';
import AssetView from '../template/AssetView';
import ContainerHeader from '../template/ContainerHeader';
import TreeView from '../template/TreeView';
import TreeSearch from '../ui/TreeSearch';

type ContainerProps = {
  selectedCompanyId: string | null;
}

const Container: React.FC<ContainerProps> = ({ selectedCompanyId }) => {
  const { companies, fetchCompanies } = useCompanyStore();
  const [companyName, setCompanyName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<(Asset | Location)[]>([]);
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [filterOperating, setFilterOperating] = useState<boolean>(false);
  const [filterCritical, setFilterCritical] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | Location | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (selectedCompanyId) {
      const selectedCompany = companies.find(company => company.id === selectedCompanyId);
      setCompanyName(selectedCompany ? selectedCompany.name : '');
    } else {
      setCompanyName('');
    }
    setSearchResults([]);
    setExpandAll(false);
    setFilterOperating(false);
    setFilterCritical(false);
    setSelectedAsset(null); // Reset selected asset on company change
  }, [selectedCompanyId, companies]);

  const handleSearch = useCallback((results: (Asset | Location)[], expand: boolean) => {
    setSearchResults(results);
    setExpandAll(expand);
  }, []);

  const handleFilterToggle = useCallback((filterType: 'operating' | 'critical') => {
    if (filterType === 'operating') {
      setFilterOperating(prev => !prev);
    } else {
      setFilterCritical(prev => !prev);
    }
    setSelectedAsset(null); // Clear selected asset on filter toggle
  }, []);

  const handleAssetSelect = (asset: Asset | Location) => {
    setSelectedAsset(asset);
  };

  return (
    <section className="fixed top-16 bg-white rounded-md p-2 border border-tractian-gray-50" style={{ width: '98vw', maxHeight: '1200px' }}>
      <ContainerHeader 
        companyName={companyName} 
        onFilterToggle={handleFilterToggle}
        filterOperating={filterOperating}
        filterCritical={filterCritical}
      />
      <div className="flex gap-2">
        <div className="w-2/5 border border-tractian-gray-50 rounded-md p-2"> {/* 35% width */}
          {selectedCompanyId && (
            <TreeSearch 
              selectedCompanyId={selectedCompanyId} 
              onSearch={handleSearch} 
            />
          )}
          <TreeView 
            selectedCompanyId={selectedCompanyId} 
            searchResults={searchResults} 
            expandAll={expandAll}
            filterOperating={filterOperating}
            filterCritical={filterCritical}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect} // Pass the select handler
          />
        </div>
        <div className="w-3/5 border border-tractian-gray-50 rounded-md p-2"> {/* 65% width */}
          {selectedAsset && 'sensorType' in selectedAsset ? (
            <AssetView 
              name={selectedAsset.name}
              sensorType={selectedAsset.sensorType}
              sensorId={selectedAsset.sensorId}
              gatewayId={selectedAsset.gatewayId}
              status={selectedAsset.status}
              locationId={selectedAsset.locationId} // Pass locationId to AssetView
            />
          ) : (
            <div className="text-center text-tractian-blue-100">Selecione um ativo para visualizar</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Container;
