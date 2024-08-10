import React, { useState } from 'react';
import alertIcon from '../../assets/icons/alert.svg';
import sensorIcon from '../../assets/icons/sensor.svg';
import { useAssetStore } from '../../store/assetStore'; // Import Zustand store
import Button from '../ui/Button';

type HeaderProps = {
  companyName: string;
};

const Header: React.FC<HeaderProps> = ({ companyName }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { toggleFilterOperating, toggleFilterCritical } = useAssetStore(); // Access actions from the store

  const handleFilterClick = (selectedFilter: string) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(selectedFilter)
        ? prevFilters.filter(filter => filter !== selectedFilter)
        : [...prevFilters, selectedFilter]
    );

    // Dispatch actions based on the selected filter
    if (selectedFilter === 'sensor') {
      toggleFilterOperating();
    } else if (selectedFilter === 'alert') {
      toggleFilterCritical();
    }
  };

  return (
    <header className="top-0 w-full h-12 flex justify-between items-center px-4 mb-4">
      <div className="flex items-center text-left">
        <span className="font-semibold text-xl leading-[1.25rem]">
          Ativos
        </span>
        <span className="font-normal text-sm leading-[1.25rem] text-center ml-1">
          / {companyName} Unit
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          icon={<img src={sensorIcon} alt="Sensor Icon" className="h-5 w-5" />} 
          title="Sensor de Energia" 
          isSelected={selectedFilters.includes('sensor')} 
          onClick={() => handleFilterClick('sensor')}
        />
        <Button 
          icon={<img src={alertIcon} alt="Alert Icon" className="h-5 w-5" />} 
          title="Crítico" 
          isSelected={selectedFilters.includes('alert')} 
          onClick={() => handleFilterClick('alert')}
        />
      </div>
    </header>
  );
};

export default Header;
