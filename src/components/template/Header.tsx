import React, { useEffect } from 'react';
import goldIcon from '../../assets/icons/Gold.svg';
import tractianLogo from '../../assets/imgs/tractian-logo.png';
import { useCompanyStore } from '../../store';
import Button from '../ui/Button';

type HeaderProps = {
  onSelectCompany: (companyId: string | null) => void;
  selectedCompanyId: string | null;
  onClearSearch: () => void;
};

const Header: React.FC<HeaderProps> = ({ onSelectCompany, selectedCompanyId, onClearSearch }) => {
  const { companies, fetchCompanies } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCompanyClick = (companyId: string) => {
    if (selectedCompanyId === companyId) {
      onSelectCompany(null); // Deselect the company
    } else {
      onSelectCompany(companyId); // Select the clicked company
    }
    onClearSearch(); // Clear the search input
  };

  return (
    <header className="fixed z-50 top-0 w-full h-12 bg-gray-800 text-white flex justify-between items-center px-4">
      <img src={tractianLogo} alt="Tractian Logo" className="h-3.5" />
      <nav className="flex space-x-4">
        {companies.map((company) => (
          <Button 
            key={company.id} 
            icon={<img src={goldIcon} alt={`${company.name} Icon`} className="h-5 w-5" />} 
            title={company.name + ' Unit'} 
            onClick={() => handleCompanyClick(company.id)}
            isSelected={selectedCompanyId === company.id}
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;