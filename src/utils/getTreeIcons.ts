import assetIconB from '../assets/icons/asset-b.svg';
import assetIconW from '../assets/icons/asset-w.svg';
import componentIconB from '../assets/icons/component-b.png';
import componentIconW from '../assets/icons/component-w.png';
import locationIconB from '../assets/icons/location-b.svg';
import locationIconW from '../assets/icons/location-w.svg';
import alertAlertIcon from '../assets/icons/status-alert.svg';
import alertOperationalIcon from '../assets/icons/status-operational.svg';

export const getTreeIcons = (
  type: 'location' | 'asset' | 'component',
  isSelected: boolean,
  status?: string | null
) => {
  const getIcon = () => {
    if (type === 'location') return isSelected ? locationIconW : locationIconB;
    if (type === 'asset') return isSelected ? assetIconW : assetIconB;
    if (type === 'component') return isSelected ? componentIconW : componentIconB;
    return undefined;
  };

  const getStatusIcon = () => {
    if (status === 'operating') return alertOperationalIcon;
    if (status === 'alert') return alertAlertIcon;
    return undefined;
  };

  const iconSrc = getIcon();
  const statusIconSrc = getStatusIcon();
  const statusIconSize = status === 'operating' ? 'w-3 h-3' : 'w-2 h-2';

  return { iconSrc, statusIconSrc, statusIconSize };
};
