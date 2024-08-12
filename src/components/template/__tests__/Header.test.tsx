import { fireEvent, render, screen } from '@testing-library/react';
import { useCompanyStore } from '../../../store';
import Header from '../Header';

jest.mock('../../../store');

const mockedUseCompanyStore = jest.mocked(useCompanyStore);

describe('Header', () => {
  const mockOnSelectCompany = jest.fn();
  const mockOnClearSearch = jest.fn();
  const mockFetchCompanies = jest.fn();

  const mockCompanies = [
    { id: 'company1', name: 'Company 1' },
    { id: 'company2', name: 'Company 2' },
  ];

  beforeEach(() => {
    mockedUseCompanyStore.mockReturnValue({
      companies: mockCompanies,
      fetchCompanies: mockFetchCompanies,
    });
  });

  it('renders company buttons', () => {
    render(
      <Header
        onSelectCompany={mockOnSelectCompany}
        selectedCompanyId={null}
        onClearSearch={mockOnClearSearch}
      />
    );

    expect(screen.getByText('Company 1 Unit')).toBeInTheDocument();
    expect(screen.getByText('Company 2 Unit')).toBeInTheDocument();
  });

  it('calls onSelectCompany when a company button is clicked', () => {
    render(
      <Header
        onSelectCompany={mockOnSelectCompany}
        selectedCompanyId={null}
        onClearSearch={mockOnClearSearch}
      />
    );

    fireEvent.click(screen.getByText('Company 1 Unit'));
    expect(mockOnSelectCompany).toHaveBeenCalledWith('company1');
    expect(mockOnClearSearch).toHaveBeenCalled();
  });

  it('deselects company when clicked again', () => {
    render(
      <Header
        onSelectCompany={mockOnSelectCompany}
        selectedCompanyId="company1"
        onClearSearch={mockOnClearSearch}
      />
    );

    fireEvent.click(screen.getByText('Company 1 Unit'));
    expect(mockOnSelectCompany).toHaveBeenCalledWith(null);
    expect(mockOnClearSearch).toHaveBeenCalled();
  });
});
