import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DonationForm from './DonationForm';
import { ToastContainer } from 'react-toastify';

describe('DonationForm', () => {
  it('shows validation errors for empty fields', async () => {
    render(<><DonationForm /><ToastContainer /></>);
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /submit donation/i }));
    await waitFor(() => {
      expect(screen.getByText(/Quantity must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('shows loading state on submit', async () => {
    render(<><DonationForm /><ToastContainer /></>);
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test item' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test location' } });
    fireEvent.click(screen.getByRole('button', { name: /submit donation/i }));
    expect(screen.getByText(/Submitting.../i)).toBeInTheDocument();
  });
}); 