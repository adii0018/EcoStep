import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TipsPageClient from '../../app/(app)/tips/TipsPageClient';
import axios from 'axios';

jest.mock('axios');

describe('TipsPageClient Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default fallback tips initially if API is not called yet', () => {
    render(<TipsPageClient />);
    
    // Check if the title is there
    expect(screen.getByText('AI Eco Tips')).toBeInTheDocument();
    
    // The button to generate tips should be there
    expect(screen.getByRole('button', { name: /Generate Personalised AI Tips/i })).toBeInTheDocument();
  });

  it('fetches new tips when the button is clicked', async () => {
    const user = userEvent.setup();
    const mockAiTips = [
      { _id: '1', tip: 'Use public transport more often to save CO2.', category: 'travel' }
    ];

    axios.get.mockResolvedValueOnce({ data: { success: true, tips: mockAiTips } });

    render(<TipsPageClient />);

    const btn = screen.getByRole('button', { name: /Generate Personalised AI Tips/i });
    await user.click(btn);

    // Wait for the new tip to appear
    await waitFor(() => {
      expect(screen.getByText('Use public transport more often to save CO2.')).toBeInTheDocument();
    });
  });
});
