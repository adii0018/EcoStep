import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginClient from '../../app/(auth)/login/LoginClient';
import axios from 'axios';
import Cookies from 'js-cookie';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a user to login and set cookies', async () => {
    const user = userEvent.setup();
    
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'fake-jwt-token',
        user: { name: 'Test User', email: 'test@example.com' }
      }
    });

    render(<LoginClient />);

    // Fill out form
    await user.type(screen.getByPlaceholderText('name@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');

    // Submit
    const loginButton = screen.getByRole('button', { name: /Sign in/i });
    await user.click(loginButton);

    // Verify API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'test@example.com', password: 'password123' }
      );
    });

    // Verify Cookie set
    expect(Cookies.set).toHaveBeenCalledWith('ecostep_token', 'fake-jwt-token', expect.any(Object));
  });
});
