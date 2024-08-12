import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ImageUpload from '../ImageUpload';

test('displays loading message while an image is being processed', async () => {
  const mockOnImageUpload = jest.fn();
  const { container } = render(<ImageUpload onImageUpload={mockOnImageUpload} />);

  const input = container.querySelector('input[type="file"]');
  if (input) {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(file);
    });
  } else {
    throw new Error('File input not found');
  }
});
