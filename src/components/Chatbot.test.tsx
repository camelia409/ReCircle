import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chatbot from './Chatbot';

// Mock fetch
global.fetch = jest.fn();

describe('Chatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat button', () => {
    render(<Chatbot />);
    expect(screen.getByLabelText(/Open chat/i)).toBeInTheDocument();
  });

  it('opens chat panel when button is clicked', () => {
    render(<Chatbot />);
    const button = screen.getByLabelText(/Open chat/i);
    fireEvent.click(button);
    expect(screen.getByText(/ReCircle Assistant/i)).toBeInTheDocument();
  });

  it('sends message when enter is pressed', async () => {
    render(<Chatbot />);
    const button = screen.getByLabelText(/Open chat/i);
    fireEvent.click(button);
    
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'How to donate?' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText(/How to donate?/i)).toBeInTheDocument();
    });
  });
}); 