import { fetchCompanies } from '../../api';
import { getCompaniesSchema } from '../../schemas';

jest.mock('@tauri-apps/api/http', () => ({
  fetch: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue([{ id: '1', name: 'Company 1' }]),
  }),
}));

describe('fetchCompanies', () => {
  it('should fetch and validate companies data', async () => {
    const data = await fetchCompanies();
    expect(data).toEqual([{ id: '1', name: 'Company 1' }]);
    expect(getCompaniesSchema.parse(data)).toEqual([{ id: '1', name: 'Company 1' }]);
  });
});
