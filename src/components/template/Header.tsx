import React, { useEffect } from 'react';
import goldIcon from '../../assets/icons/Gold.svg';
import tractianLogo from '../../assets/imgs/tractian-logo.png';
import { useCompanyStore } from '../../store';
import Button from '../ui/Button';

type HeaderProps = {
  onSelectCompany: (companyId: string | null) => void;
  selectedCompanyId: string | null;
};

const Header: React.FC<HeaderProps> = ({ onSelectCompany, selectedCompanyId }) => {
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
  };

  return (
    <header className="fixed top-0 w-full h-12 bg-gray-800 text-white flex justify-between items-center px-4">
      <img src={tractianLogo} alt="Tractian Logo" className="h-3.5" />
      <nav className="flex space-x-4">
        {companies.map((company) => (
          <Button 
            key={company.id} 
            icon={<img src={goldIcon} alt="Company Icon" className="h-5 w-5" />} 
            title={company.name} 
            onClick={() => handleCompanyClick(company.id)}
            isSelected={selectedCompanyId === company.id}
          />
        ))}
      </nav>
    </header>
  );
};

export default Header;
