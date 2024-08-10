import React, { useEffect } from 'react';
import goldIcon from '../../assets/icons/Gold.svg';
import tractianLogo from '../../assets/imgs/tractian-logo.png';
import { useCompanyStore } from '../../store';
import Button from '../ui/Button';

type HeaderProps = {
    onSelectCompany: (companyName: string) => void;
    selectedCompanyName: string | null;
};

const Header: React.FC<HeaderProps> = ({ onSelectCompany, selectedCompanyName }) => {
    const { companies, fetchCompanies } = useCompanyStore();

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <img src={tractianLogo} alt="Tractian Logo" className="h-10" />
            <nav className="flex space-x-4">
                {companies.map(company => (
                    <Button 
                        key={company.id} 
                        icon={<img src={goldIcon} alt="Company Icon" className="h-5 w-5" />} 
                        title={company.name} 
                        onClick={() => onSelectCompany(company.name)}
                        isSelected={selectedCompanyName === company.name}
                    />
                ))}
            </nav>
        </header>
    );
};

export default Header;