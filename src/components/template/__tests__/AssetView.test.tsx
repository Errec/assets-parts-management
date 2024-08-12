import { render, screen } from '@testing-library/react';
import React from 'react';
import { useLocationStore } from '../../../store/locationStore';
import AssetView from '../AssetView';

jest.mock('../../../store/locationStore');

const mockedUseLocationStore = jest.mocked(useLocationStore);

describe('AssetView', () => {
  const mockLocationStore = {
    locationsByCompany: {
      company1: [
        { id: 'loc1', name: 'Location 1' },
      ],
    },
    fetchLocations: jest.fn(),
  };

  beforeEach(() => {
    mockedUseLocationStore.mockReturnValue(mockLocationStore);
  });

  it('renders asset information correctly', () => {
    render(
      <AssetView
        name="Test Asset"
        sensorType="energy"
        sensorId="sensor123"
        gatewayId="gateway456"
        status="operating"
        locationId="loc1"
      />
    );

    expect(screen.getByText('Test Asset')).toBeInTheDocument();
    expect(screen.getByText('Elétrico')).toBeInTheDocument();
    expect(screen.getByText('sensor123')).toBeInTheDocument();
    expect(screen.getByText('gateway456')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
  });

  it('displays N/A for missing information', () => {
    render(<AssetView name="Test Asset" />);

    expect(screen.getByText('Test Asset')).toBeInTheDocument();

    // Using getAllByText to account for multiple N/A instances
    const naElements = screen.getAllByText('N/A');
    expect(naElements.length).toBeGreaterThan(0);
  });
});
