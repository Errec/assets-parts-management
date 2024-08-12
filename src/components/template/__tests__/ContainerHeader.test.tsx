import { fireEvent, render, screen } from '@testing-library/react';
import ContainerHeader from '../ContainerHeader';

describe('ContainerHeader', () => {
  const mockOnFilterToggle = jest.fn();

  it('renders company name correctly', () => {
    render(
      <ContainerHeader
        companyName="Test Company"
        onFilterToggle={mockOnFilterToggle}
        filterOperating={false}
        filterCritical={false}
      />
    );

    // Adjusted matcher to account for potential whitespace or other formatting
    expect(screen.getByText(/Test Company\s+Unit/i)).toBeInTheDocument();
  });

  it('calls onFilterToggle when buttons are clicked', () => {
    render(
      <ContainerHeader
        companyName="Test Company"
        onFilterToggle={mockOnFilterToggle}
        filterOperating={false}
        filterCritical={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Sensor de Energia'));
    expect(mockOnFilterToggle).toHaveBeenCalledWith('operating');

    fireEvent.click(screen.getByLabelText('Crítico'));
    expect(mockOnFilterToggle).toHaveBeenCalledWith('critical');
  });
});
