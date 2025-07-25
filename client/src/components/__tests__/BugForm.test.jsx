// src/components/__tests__/BugForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BugForm from '../BugForm';
import API from '../../api';
import { vi } from 'vitest';

// ✅ Mock API
vi.mock('../../api');

// ✅ Mock useAuth to provide a dummy user
vi.mock('../../context/useAuth', () => ({
  __esModule: true,
  default: () => ({
    user: { username: 'testuser', role: 'user' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('BugForm Component', () => {
  it('renders form fields', () => {
    render(<BugForm onBugAdded={() => {}} />);
    expect(screen.getByPlaceholderText(/Bug Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
  });

  it('submits the form and calls API', async () => {
    const mockAdd = vi.fn();
    API.post.mockResolvedValue({
      data: {
        title: 'Mock Bug',
        description: 'Test Desc',
        reportedBy: 'testuser',
      },
    });

    render(<BugForm onBugAdded={mockAdd} />);

    fireEvent.change(screen.getByPlaceholderText(/Bug Title/i), {
      target: { value: 'Mock Bug' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: 'Test Desc' },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for async operations to settle
    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/bugs', {
        title: 'Mock Bug',
        description: 'Test Desc',
        reportedBy: 'testuser',
      });

      expect(mockAdd).toHaveBeenCalled();
    });
  });
});
