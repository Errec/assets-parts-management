import { fetch as tauriFetch } from '@tauri-apps/api/http';
import { fetchCompanyLocations } from '../../api';
import { getLocationsSchema } from '../../schemas';

jest.mock('@tauri-apps/api/http', () => ({
  fetch: jest.fn(),
}));

describe('fetchCompanyLocations', () => {
  const companyId = '1';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and validate company locations data', async () => {
    const mockData = [
      { id: '1', name: 'Location 1', parentId: null },
      { id: '2', name: 'Sub-location 1', parentId: '1' },
    ];
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchCompanyLocations(companyId);
    expect(data).toEqual(mockData);
    expect(getLocationsSchema.parse(data)).toEqual(mockData);
  });

  it('should handle empty locations array', async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: [] });

    const data = await fetchCompanyLocations(companyId);
    expect(data).toEqual([]);
  });

  it('should handle invalid data format', async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: 'invalid' });

    await expect(fetchCompanyLocations(companyId)).rejects.toThrow('Invalid data received from the API');
  });
});