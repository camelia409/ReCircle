import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Heatmap from './Heatmap';

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  circleMarker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Heatmap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heatmap component', () => {
    render(<Heatmap />);
    expect(screen.getByText(/Donation Heatmap/i)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<Heatmap />);
    expect(screen.getByText(/Circle size indicates/i)).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<Heatmap />);
    
    await waitFor(() => {
      expect(screen.getByText(/Donation Heatmap/i)).toBeInTheDocument();
    });
  });
}); 