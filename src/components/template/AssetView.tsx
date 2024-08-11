import React, { useEffect, useState } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { Location } from '../../types';
import ImageUpload from '../ui/ImageUpload';

interface AssetViewProps {
  name: string;
  sensorType?: string | null;
  sensorId?: string | null;
  gatewayId?: string | null;
  status?: string | null;
  locationId?: string | null;
}

const AssetView: React.FC<AssetViewProps> = ({
  name,
  sensorType = 'N/A',
  sensorId = 'N/A',
  gatewayId = 'N/A',
  status = 'N/A',
  locationId = null,
}) => {
  const [locationName, setLocationName] = useState<string | null>('N/A');
  const { locationsByCompany } = useLocationStore();

  useEffect(() => {
    if (locationId) {
      const location = Object.values(locationsByCompany).flat().find((loc: Location) => loc.id === locationId);
      if (location) {
        setLocationName(location.name);
      }
    }
  }, [locationId, locationsByCompany]);

  const equipmentType = sensorType === 'energy' ? 'Elétrico' : sensorType === 'vibration' ? 'Mecânico' : 'N/A';
  const equipmentIcon = sensorType === 'energy' ? '/src/assets/icons/electric.svg' : sensorType === 'vibration' ? '/src/assets/icons/mechanic.svg' : '';

  return (
    <div className="p-2">
      <div>
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-lg font-semibold">{name}</h2>
          <span>{status}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 border-b border-gray-200">
          <div>
            <ImageUpload onImageUpload={() => {}} currentImage={undefined} />
          </div>
          <div>
            <div className="pb-6 border-b border-gray-200">
              <h3 className="font-bold">Tipo de Equipamento</h3>
              <p>{equipmentType}</p>
            </div>
            <div className="pt-6">
              <h3 className="font-bold">Responsáveis</h3>
              <div className="flex items-center">
                {equipmentIcon && <img src={equipmentIcon} alt="Icon" className="w-5 h-5 mr-2" />}
                <span>{locationName}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-3 flex justify-between">
          <div>
            <h3 className="font-bold">Sensor</h3>
            <div className="flex items-center">
              <img src="/src/assets/icons/wifi_tethering.svg" alt="Sensor" className="w-5 h-5 mr-2" />
              <span>{sensorId || 'N/A'}</span>
            </div>
          </div>
          <div className="mr-56">
            <h3 className="font-bold">Receptor</h3>
            <div className="flex items-center">
              <img src="/src/assets/icons/MdOutlineRouter.svg" alt="Receptor" className="w-5 h-5 mr-1" />
              <span>{gatewayId || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetView;
