import { fetch as tauriFetch } from '@tauri-apps/api/http';
import { fetchCompanies } from '../../api';
import { getCompaniesSchema } from '../../schemas';

jest.mock('@tauri-apps/api/http', () => ({
  fetch: jest.fn(),
}));

describe('fetchCompanies', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and validate companies data', async () => {
    const mockData = [{ id: '1', name: 'Company 1' }];
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const data = await fetchCompanies();
    expect(data).toEqual(mockData);
    expect(getCompaniesSchema.parse(data)).toEqual(mockData);
  });

  it('should handle undefined data', async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({ data: undefined });

    await expect(fetchCompanies()).rejects.toThrow('Invalid data received from the API');
  });

  it('should handle network errors', async () => {
    (tauriFetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCompanies()).rejects.toThrow('Network error');
  });
});