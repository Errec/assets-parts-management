import React, { useState } from 'react';
import alertIcon from '../../assets/icons/alert.svg';
import sensorIcon from '../../assets/icons/sensor.svg';
import Button from '../ui/Button';

type HeaderProps = {
  companyName: string;
};

const Header: React.FC<HeaderProps> = ({ companyName }) => {
  const [filter, setFilter] = useState<string | null>(null);

  const handleFilterClick = (selectedFilter: string) => {
    if (filter === selectedFilter) {
      setFilter(null); // Unselect the filter if it's already selected
    } else {
      setFilter(selectedFilter); // Select the clicked filter
    }
  };

  return (
    <header className="top-0 w-full h-12 flex justify-between items-center px-4 mb-4">
      <div className="flex align-middle text-left">
        <span className="font-semibold text-xl leading-7 text-left">
          Ativos
        </span><span className="font-normal text-sm leading-5 text-center">
          / { companyName } Unit
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          icon={<img src={sensorIcon} alt="Sensor Icon" className="h-5 w-5" />} 
          title="Sensor de Energia" 
          isSelected={filter === 'sensor'} 
          onClick={() => handleFilterClick('sensor')}
        />
        <Button 
          icon={<img src={alertIcon} alt="Alert Icon" className="h-5 w-5" />} 
          title="Crítico" 
          isSelected={filter === 'alert'} 
          onClick={() => handleFilterClick('alert')}
        />
      </div>
    </header>
  );
};

export default Header;
