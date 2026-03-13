import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Toast, useToast, type ToastMessage } from './Toast';

describe('Toast Component', () => {
  it('should render toast messages', () => {
    const messages: ToastMessage[] = [
      { id: '1', type: 'success', message: 'Success message' },
    ];

    render(<Toast messages={messages} onDismiss={vi.fn()} />);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should render multiple toast messages', () => {
    const messages: ToastMessage[] = [
      { id: '1', type: 'success', message: 'First message' },
      { id: '2', type: 'error', message: 'Second message' },
    ];

    render(<Toast messages={messages} onDismiss={vi.fn()} />);

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('should call onDismiss after duration', async () => {
    const onDismiss = vi.fn();
    const messages: ToastMessage[] = [
      { id: '1', type: 'info', message: 'Test message', duration: 100 },
    ];

    render(<Toast messages={messages} onDismiss={onDismiss} />);

    await waitFor(
      () => {
        expect(onDismiss).toHaveBeenCalledWith('1');
      },
      { timeout: 500 }
    );
  });

  it('should display correct icon for each type', () => {
    const types: Array<ToastMessage['type']> = ['success', 'error', 'warning', 'info'];
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

    types.forEach((type) => {
      const messages: ToastMessage[] = [{ id: `${type}-1`, type, message: `${type} message` }];
      const { container } = render(<Toast messages={messages} onDismiss={vi.fn()} />);

      expect(container.textContent).toContain(icons[type]);
    });
  });
});

describe('useToast Hook', () => {
  it('should add toast message', () => {
    const TestComponent = () => {
      const { messages, addToast } = useToast();

      return (
        <div>
          <button
            onClick={() => addToast('Test message', 'success')}
          >
            Add Toast
          </button>
          {messages.map((msg) => (
            <div key={msg.id}>{msg.message}</div>
          ))}
        </div>
      );
    };

    render(<TestComponent />);

    const button = screen.getByText('Add Toast');
    button.click();

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should dismiss toast message', async () => {
    const TestComponent = () => {
      const { messages, addToast, dismissToast } = useToast();

      return (
        <div>
          <button
            onClick={() => addToast('Test message', 'success')}
          >
            Add Toast
          </button>
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.message}
              <button onClick={() => dismissToast(msg.id)}>Dismiss</button>
            </div>
          ))}
        </div>
      );
    };

    render(<TestComponent />);

    screen.getByText('Add Toast').click();
    expect(screen.getByText('Test message')).toBeInTheDocument();

    screen.getByText('Dismiss').click();
    
    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });
});
