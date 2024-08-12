import { render, screen } from '@testing-library/react';
import { useAssetStore } from '../../../store/assetStore';
import { useLocationStore } from '../../../store/locationStore';
import TreeView from '../TreeView';

jest.mock('../../../store/assetStore');
jest.mock('../../../store/locationStore');
jest.mock('react-window', () => ({
  FixedSizeList: ({ children }: any) => children({ index: 0, style: {} }),
}));

const mockedUseAssetStore = jest.mocked(useAssetStore);
const mockedUseLocationStore = jest.mocked(useLocationStore);

describe('TreeView', () => {
  const mockAssetStore = {
    assetsByCompany: {
      company1: [
        { id: 'asset1', name: 'Asset 1', status: 'operating' },
      ],
    },
    fetchAssets: jest.fn(),
  };

  const mockLocationStore = {
    locationsByCompany: {
      company1: [
        { id: 'loc1', name: 'Location 1' },
      ],
    },
    fetchLocations: jest.fn(),
  };

  beforeEach(() => {
    mockedUseAssetStore.mockReturnValue(mockAssetStore);
    mockedUseLocationStore.mockReturnValue(mockLocationStore);
  });

  it('displays "No results found" when tree is empty', () => {
    mockedUseAssetStore.mockReturnValue({
      ...mockAssetStore,
      assetsByCompany: { company1: [] },
    });

    render(
      <TreeView
        selectedCompanyId="company1"
        searchResults={[]}
        expandAll={false}
        filterOperating={false}
        filterCritical={false}
        selectedAsset={null}
        onAssetSelect={() => {}}
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
