import '@testing-library/jest-dom'; // Ensure this is imported
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Button from '../Button'; // Adjust the import path to your Button component

describe('Button component', () => {
  it('renders correctly with given props', () => {
    render(
      <Button 
        icon={<span data-testid="icon">🔍</span>} 
        title="Search" 
        onClick={() => {}} 
        isSelected={false} 
        className="custom-class" 
        selectedStyles="bg-green-600 text-white" 
        defaultStyles="bg-red-600 text-white"
      />
    );

    // Check if title is rendered
    expect(screen.getByText('Search')).toBeInTheDocument();
    
    // Check if icon is rendered
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    
    // Check if additional className is applied
    expect(screen.getByRole('button')).toHaveClass('custom-class');
    
    // Check default styling is applied when isSelected is false
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('applies selectedStyles when isSelected is true', () => {
    render(
      <Button 
        icon={<span data-testid="icon">🔍</span>} 
        title="Search" 
        onClick={() => {}} 
        isSelected={true} 
        selectedStyles="bg-green-600 text-white"
        defaultStyles="bg-red-600 text-white"
      />
    );

    // Check selected styling is applied
    expect(screen.getByRole('button')).toHaveClass('bg-green-600');
  });

  it('calls onClick handler when button is clicked', () => {
    const handleClick = jest.fn();
    
    render(
      <Button 
        icon={<span data-testid="icon">🔍</span>} 
        title="Search" 
        onClick={handleClick} 
        isSelected={false}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    // Verify onClick handler is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});