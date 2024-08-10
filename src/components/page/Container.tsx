import React, { useEffect, useState } from 'react';
import { useCompanyStore } from '../../store'; // Adjust the import path as needed
import ContainerHeader from '../template/ContainerHeader'; // Adjust the import path as needed
import TreeView from '../template/TreeView'; // Adjust the import path as needed

interface ContainerProps {
  selectedCompanyId: string | null;
}

const Container: React.FC<ContainerProps> = ({ selectedCompanyId }) => {
  const { companies, fetchCompanies } = useCompanyStore();
  const [companyName, setCompanyName] = useState<string>('');

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
  }, [selectedCompanyId, companies]);

  return (
    <section className="fixed top-16 bg-white rounded-md p-2 border border-gray-300" style={{ width: '98vw', maxHeight: '1200px' }}>
      <ContainerHeader companyName={companyName} />
      <TreeView selectedCompanyId={selectedCompanyId} />
    </section>
  );
};

export default Container;
