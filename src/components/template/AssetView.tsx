import React, { useState } from 'react';
import ImageUpload from '../ui/ImageUpload';

interface AssetViewProps {
  name: string;
  sensorType?: string | null;
  sensorId?: string | null;
  gatewayId?: string | null;
  status?: string | null;
}

const AssetView: React.FC<AssetViewProps> = ({
  name,
  sensorType = 'N/A',
  sensorId = 'N/A',
  gatewayId = 'N/A',
  status = 'N/A',
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setImage(file);
  };

  return (
    <div className="border border-gray-200 p-4 rounded-md">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span>{status}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <ImageUpload onImageUpload={handleImageUpload} currentImage={image ? URL.createObjectURL(image) : undefined} />
        </div>
        <div>
          <div className="mb-4">
            <h3 className="font-bold">Tipo de Sensor</h3>
            <p>{sensorType || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">Sensor</h3>
          <div className="flex items-center">
            <img src="/src/assets/icons/wifi_tethering.svg" alt="Sensor" className="w-5 h-5 mr-2" />
            <span>{sensorId || 'N/A'}</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Receptor</h3>
          <div className="flex items-center">
            <img src="/src/assets/icons/MdOutlineRouter.svg" alt="Receptor" className="w-5 h-5 mr-2" />
            <span>{gatewayId || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetView;
