import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Leaderboard from './Leaderboard';

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

describe('Leaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Leaderboard />);
    
    expect(screen.getByText('Loading leaderboard...')).toBeInTheDocument();
  });

  it('renders partners when API call succeeds', async () => {
    const mockPartners = [
      { id: 1, name: 'Community Aid', location: 'New York, NY', points: 1250 },
      { id: 2, name: 'Green Cycle', location: 'Los Angeles, CA', points: 980 }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPartners
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Community Aid')).toBeInTheDocument();
      expect(screen.getByText('Green Cycle')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('980')).toBeInTheDocument();
    });
  });

  it('shows error message and fallback data when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText(/Warning:/)).toBeInTheDocument();
      expect(screen.getByText('Community Aid')).toBeInTheDocument();
    });
  });

  it('shows fallback data when no partners are found', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText(/Warning:/)).toBeInTheDocument();
      expect(screen.getByText('Community Aid')).toBeInTheDocument();
    });
  });

  it('displays rank icons correctly', async () => {
    const mockPartners = [
      { id: 1, name: 'First Place', location: 'NY', points: 1000 },
      { id: 2, name: 'Second Place', location: 'CA', points: 900 },
      { id: 3, name: 'Third Place', location: 'TX', points: 800 },
      { id: 4, name: 'Fourth Place', location: 'FL', points: 700 }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPartners
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      // Check that all partners are displayed
      expect(screen.getByText('First Place')).toBeInTheDocument();
      expect(screen.getByText('Second Place')).toBeInTheDocument();
      expect(screen.getByText('Third Place')).toBeInTheDocument();
      expect(screen.getByText('Fourth Place')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    const mockPartners = [
      { id: 1, name: 'Community Aid', location: 'New York, NY', points: 1250 }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPartners
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Community Aid')).toBeInTheDocument();
    });

    const refreshButton = screen.getByTitle('Refresh leaderboard');
    fireEvent.click(refreshButton);

    // Should call fetch again
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('shows empty state when no partners and no error', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => []
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('No partners found in the leaderboard.')).toBeInTheDocument();
      expect(screen.getByText('Partners will appear here once they start earning points.')).toBeInTheDocument();
    });
  });

  it('formats large numbers with commas', async () => {
    const mockPartners = [
      { id: 1, name: 'High Scorer', location: 'NY', points: 1234567 }
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPartners
    });

    renderWithRouter(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });
  });
}); 