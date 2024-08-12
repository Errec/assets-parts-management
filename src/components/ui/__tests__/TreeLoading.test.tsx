import { render } from '@testing-library/react';
import React from 'react';
import TreeLoading from '../TreeLoading'; // Adjust the import path as needed

describe('TreeLoading', () => {
  it('renders the correct number of loading items based on height and itemHeight', () => {
    const height = 200;
    const itemHeight = 50;
    const { container } = render(<TreeLoading height={height} itemHeight={itemHeight} />);

    // Calculate the expected number of items
    const expectedItemCount = Math.ceil(height / itemHeight);

    // Find all the <li> elements
    const items = container.querySelectorAll('li');

    // Check if the number of items is as expected
    expect(items.length).toBe(expectedItemCount);
  });

  it('applies the correct styles to the container and items', () => {
    const height = 200;
    const itemHeight = 50;
    const { container } = render(<TreeLoading height={height} itemHeight={itemHeight} />);

    // Check the container height style
    const ulElement = container.querySelector('ul');
    expect(ulElement).toHaveStyle(`height: ${height}px`);

    // Check the item height and className
    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      expect(item).toHaveStyle(`height: ${itemHeight}px`);
      expect(item).toHaveClass('w-full bg-gradient-to-r from-tractian-blue-50 to-tractian-blue-200 rounded animate-pulse');
    });
  });
});
