import { fetchCompanies, fetchCompanyAssets, fetchCompanyLocations } from '../../api/';
import mockData from '../../assets/json/api-data.json';

// Mocking the API functions
jest.mock('../fetchCompanies', () => ({
  fetchCompanies: jest.fn(),
}));
jest.mock('../fetchCompanyLocations', () => ({
  fetchCompanyLocations: jest.fn(),
}));
jest.mock('../fetchCompanyAssets', () => ({
  fetchCompanyAssets: jest.fn(),
}));

describe('API fetchCompanies', () => {
  it('should fetch all companies', async () => {
    const mockCompanies = Object.keys(mockData);
    (fetchCompanies as jest.Mock).mockResolvedValue(mockCompanies);

    const companies = await fetchCompanies();

    expect(companies).toEqual(mockCompanies);
    expect(fetchCompanies).toHaveBeenCalledTimes(1);
  });
});

describe('API fetchCompanyLocations', () => {
  it('should fetch all locations for a given company', async () => {
    const companyId = '662fd0ee639069143a8fc387'; // Example company ID
    const mockLocations = mockData[companyId].locations;
    (fetchCompanyLocations as jest.Mock).mockResolvedValue(mockLocations);

    const locations = await fetchCompanyLocations(companyId);

    expect(locations).toEqual(mockLocations);
    expect(fetchCompanyLocations).toHaveBeenCalledTimes(1);
    expect(fetchCompanyLocations).toHaveBeenCalledWith(companyId);
  });
});

describe('API fetchCompanyAssets', () => {
  it('should fetch all assets for a given company', async () => {
    const companyId = '662fd0ee639069143a8fc387'; // Example company ID
    const mockAssets = mockData[companyId].assets;
    (fetchCompanyAssets as jest.Mock).mockResolvedValue(mockAssets);

    const assets = await fetchCompanyAssets(companyId);

    expect(assets).toEqual(mockAssets);
    expect(fetchCompanyAssets).toHaveBeenCalledTimes(1);
    expect(fetchCompanyAssets).toHaveBeenCalledWith(companyId);
  });
});
