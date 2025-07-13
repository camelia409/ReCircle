import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BadgeDisplay from './BadgeDisplay';

// Mock fetch
global.fetch = jest.fn();

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BadgeDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<BadgeDisplay partnerId={1} />);
    
    expect(screen.getByText('Loading badges...')).toBeInTheDocument();
  });

  it('renders badges when API call succeeds', async () => {
    const mockBadges = [
      { name: 'Eco Hero', description: 'Achieved 100+ points', earned: true },
      { name: 'Community Star', description: 'Completed 5+ claims', earned: false }
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBadges
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithRouter(<BadgeDisplay partnerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Eco Hero')).toBeInTheDocument();
      expect(screen.getByText('Community Star')).toBeInTheDocument();
    });
  });

  it('shows error message and fallback data when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<BadgeDisplay partnerId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Warning:/)).toBeInTheDocument();
      expect(screen.getByText('Eco Hero')).toBeInTheDocument();
    });
  });

  it('shows empty state when no badges are available', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithRouter(<BadgeDisplay partnerId={1} />);

    await waitFor(() => {
      expect(screen.getByText('No badges yet. Start donating and claiming items to earn badges!')).toBeInTheDocument();
    });
  });

  it('displays earned badges with different styling', async () => {
    const mockBadges = [
      { name: 'Eco Hero', description: 'Achieved 100+ points', earned: true },
      { name: 'Community Star', description: 'Completed 5+ claims', earned: false }
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBadges
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

    renderWithRouter(<BadgeDisplay partnerId={1} />);

    await waitFor(() => {
      const earnedBadge = screen.getByText('Eco Hero').closest('div');
      const unearnedBadge = screen.getByText('Community Star').closest('div');
      
      expect(earnedBadge).toHaveClass('bg-blue-50');
      expect(unearnedBadge).toHaveClass('bg-gray-50');
    });
  });
}); 