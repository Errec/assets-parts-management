import { Asset, Location } from '../types';

export const isAsset = (item: Asset | Location): item is Asset => {
  return (item as Asset).sensorId !== undefined;
};
