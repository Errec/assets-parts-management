import React, { useCallback, useEffect, useState } from 'react';
import { useCompanyStore } from '../../store';
import { Asset, Location } from '../../types';
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
    setSearchResults([]); // Clear search results when company changes
    setExpandAll(false); // Reset expandAll when company changes
  }, [selectedCompanyId, companies]);

  const handleSearch = useCallback((results: (Asset | Location)[], expand: boolean) => {
    setSearchResults(results);
    setExpandAll(expand);
  }, []);

  return (
    <section className="fixed top-16 bg-white rounded-md p-2 border border-gray-300 overflow-hidden " style={{ width: '98vw', maxHeight: '720x' }}>
      <ContainerHeader companyName={companyName} />
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
      />
    </section>
  );
};

export default Container;
