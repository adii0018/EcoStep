import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardClient from '../../app/(app)/dashboard/DashboardClient';
import axios from 'axios';
import Cookies from 'js-cookie';

// Mock the dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('sonner', () => ({
  toast: { error: jest.fn(), success: jest.fn() }
}));

const mockSummary = {
  totalCO2: 125.5,
  activitiesCount: 5,
  co2Saved: 10.2,
  thisWeekCO2: 45.0,
  recentActivities: [
    { _id: '1', type: 'Car (petrol)', co2Amount: 1.8, date: new Date().toISOString() }
  ],
  categoryBreakdown: [
    { _id: 'travel', total: 50 },
    { _id: 'food', total: 30 }
  ]
};

const mockProfile = {
  user: {
    name: 'Test User',
    ecoPoints: 120,
    streak: 3,
    lastActivityDate: new Date().toISOString()
  }
};

describe('DashboardClient Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock user from localStorage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
    Cookies.get.mockReturnValue('fake-token');
  });

  it('should render loading skeleton initially and then data', async () => {
    // Setup API mocks
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/profile')) return Promise.resolve({ data: mockProfile });
      if (url.includes('/activities/summary')) return Promise.resolve({ data: mockSummary });
      return Promise.reject(new Error('not found'));
    });

    render(<DashboardClient />);

    // Since we added a 200ms delay for the skeleton to avoid flash,
    // the component renders nothing initially, then skeleton, then data.
    // We'll wait for the data to appear.
    
    await waitFor(() => {
      expect(screen.getByText(/Hello, Test User/i)).toBeInTheDocument();
    });

    // Verify Metric Cards
    expect(screen.getByText('125.5 kg')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Activity count
    expect(screen.getByText('10.2 kg')).toBeInTheDocument();

    // Verify EcoPoints and Streak badges
    expect(screen.getByText(/120 EcoPoints/i)).toBeInTheDocument();
    expect(screen.getByText(/3 day streak/i)).toBeInTheDocument();
  });

  it('should show notification banner if no activity today', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/profile')) return Promise.resolve({ 
        data: { user: { ...mockProfile.user, lastActivityDate: pastDate.toISOString() } } 
      });
      if (url.includes('/activities/summary')) return Promise.resolve({ data: mockSummary });
      return Promise.reject(new Error('not found'));
    });

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByText(/You haven't logged any activity today!/i)).toBeInTheDocument();
    });
  });
});
