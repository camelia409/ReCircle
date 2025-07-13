import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TrendAnalysis from './TrendAnalysis';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
}));

// Mock fetch
global.fetch = jest.fn();

describe('TrendAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders trend analysis component', () => {
    render(<TrendAnalysis />);
    expect(screen.getByText(/Donation Trends/i)).toBeInTheDocument();
  });

  it('shows data updates message', () => {
    render(<TrendAnalysis />);
    expect(screen.getByText(/Data updates every 15 seconds/i)).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<TrendAnalysis />);
    
    await waitFor(() => {
      expect(screen.getByText(/Donation Trends/i)).toBeInTheDocument();
    });
  });
}); 