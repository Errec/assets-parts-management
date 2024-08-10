import React, { useEffect, useState } from 'react';
import goldIcon from '../../assets/icons/Gold.svg';
import tractianLogo from '../../assets/imgs/tractian-logo.png';
import { useCompanyStore } from '../../store';
import Button from '../ui/Button';

type HeaderProps = {
    onSelectCompany: (companyId: string) => void;
    selectedCompanyId: string | null;
};

const Header: React.FC<HeaderProps> = ({ onSelectCompany, selectedCompanyId }) => {
    const { companies, fetchCompanies } = useCompanyStore();
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchCompanies().then(() => {
            if (companies.length > 0 && initialLoad) {
                onSelectCompany(companies[0].id); // Select the first company by default
                setInitialLoad(false);
            }
        });
    }, [fetchCompanies, companies, onSelectCompany, initialLoad]);

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <img src={tractianLogo} alt="Tractian Logo" className="h-10" />
            <nav className="flex space-x-4">
                {companies.map(company => (
                    <Button 
                        key={company.id} 
                        icon={<img src={goldIcon} alt="Company Icon" className="h-5 w-5" />} 
                        title={company.name} 
                        onClick={() => onSelectCompany(company.id)}
                        isSelected={selectedCompanyId === company.id}
                        disabled={selectedCompanyId === company.id} // Disable if selected
                    />
                ))}
            </nav>
        </header>
    );
};

export default Header;
