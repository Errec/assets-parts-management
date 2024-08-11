import React from 'react';
import alertIcon from '../../assets/icons/alert.svg';
import sensorIcon from '../../assets/icons/sensor.svg';
import Button from '../ui/Button';

type HeaderProps = {
  companyName: string;
  onFilterToggle: (filterType: 'operating' | 'critical') => void;
  filterOperating: boolean;
  filterCritical: boolean;
};

const Header: React.FC<HeaderProps> = ({ companyName, onFilterToggle, filterOperating, filterCritical }) => {
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
          isSelected={filterOperating} 
          onClick={() => onFilterToggle('operating')}
        />
        <Button 
          icon={<img src={alertIcon} alt="Alert Icon" className="h-5 w-5" />} 
          title="Crítico" 
          isSelected={filterCritical} 
          onClick={() => onFilterToggle('critical')}
        />
      </div>
    </header>
  );
};

export default Header;