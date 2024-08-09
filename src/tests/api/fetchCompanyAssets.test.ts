import { fetch as tauriFetch } from '@tauri-apps/api/http';
import { fetchCompanyAssets } from '../../api';
import { getAssetsSchema } from '../../schemas';

jest.mock('@tauri-apps/api/http', () => ({
  fetch: jest.fn(),
}));

describe('fetchCompanyAssets', () => {
  const companyId = '1';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and validate company assets data', async () => {
    const mockData = [
      { id: '1', name: 'Asset 1', locationId: '1' },
      { id: '2', name: 'Sub-asset 1', parentId: '1' },
      { id: '3', name: 'Component 1', parentId: '2', sensorType: 'vibration', status: 'operating' },
    ];
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchCompanyAssets(companyId);
    expect(data).toEqual(mockData);
    expect(() => getAssetsSchema.parse(data)).not.toThrow();
  });

  it('should handle assets with no location or parent', async () => {
    const mockData = [
      { id: '1', name: 'Unlinked Asset', parentId: null, locationId: null },
    ];
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchCompanyAssets(companyId);
    expect(data).toEqual(mockData);
    expect(() => getAssetsSchema.parse(data)).not.toThrow();
  });

  it('should handle API errors', async () => {
    (tauriFetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    await expect(fetchCompanyAssets(companyId)).rejects.toThrow('API error');
  });
});