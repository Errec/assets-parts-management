import { invoke } from '@tauri-apps/api/tauri';
import { Asset } from '../types/asset';
import { Location } from '../types/location';

export const fetchCompanyAssetsData = async (): Promise<Asset[]> => {
  try {
    const assets = await invoke<Asset[]>('fetch_assets');
    return assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw new Error('Could not fetch assets');
  }
};

export const fetchCompanyLocationsData = async (): Promise<Location[]> => {
  try {
    const locations = await invoke<Location[]>('fetch_locations');
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Could not fetch locations');
  }
};
