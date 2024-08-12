import React from 'react';
import alertIconB from '../../assets/icons/alert-b.svg';
import alertIconW from '../../assets/icons/alert-w.svg';
import sensorIconB from '../../assets/icons/sensor-b.svg';
import sensorIconW from '../../assets/icons/sensor-w.svg';
import Button from '../ui/Button';

type ContainerHeadProps = {
  companyName: string;
  onFilterToggle: (filterType: 'operating' | 'critical') => void;
  filterOperating: boolean;
  filterCritical: boolean;
};

const ContainerHead: React.FC<ContainerHeadProps> = ({ companyName, onFilterToggle, filterOperating, filterCritical }) => {
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
          icon={<img src={filterOperating ? sensorIconW : sensorIconB} alt="Sensor Icon" className="h-5 w-5 transition-colors duration-300" />} 
          title="Sensor de Energia" 
          isSelected={filterOperating} 
          onClick={() => onFilterToggle('operating')}
          className={`transition-colors duration-300 ${filterOperating ? 'text-white' : 'text-blue-500'}`}
        />
        <Button 
          icon={<img src={filterCritical ? alertIconW : alertIconB} alt="Alert Icon" className="h-5 w-5 transition-colors duration-300" />} 
          title="Crítico" 
          isSelected={filterCritical} 
          onClick={() => onFilterToggle('critical')}
          className={`transition-colors duration-300 ${filterCritical ? 'text-white' : 'text-blue-500'}`}
        />
      </div>
    </header>
  );
};

export default ContainerHead;
