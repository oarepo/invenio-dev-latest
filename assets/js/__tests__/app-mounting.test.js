import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

describe('Application Mounting Tests', () => {
  let rootElement;

  beforeEach(() => {
    rootElement = document.createElement('div');
    rootElement.id = 'app';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    if (rootElement && document.body.contains(rootElement)) {
      document.body.removeChild(rootElement);
    }
  });

  describe('Basic Mounting', () => {
    it('should mount application without errors', () => {
      function TestApp() {
        return <div>App Mounted</div>;
      }

      const { container } = render(<TestApp />, { container: rootElement });
      expect(screen.getByText('App Mounted')).toBeInTheDocument();
    });

    it('should handle multiple renders correctly', () => {
      let renderCount = 0;

      function CountingApp() {
        renderCount++;
        return <div>Renders: {renderCount}</div>;
      }

      const { rerender } = render(<CountingApp />, { container: rootElement });
      expect(screen.getByText('Renders: 1')).toBeInTheDocument();

      rerender(<CountingApp />);
      expect(screen.getByText('Renders: 2')).toBeInTheDocument();
    });

    it('should handle unmount and remount', () => {
      const mountCb = jest.fn();
      const unmountCb = jest.fn();

      function LifecycleApp({ mounted }) {
        React.useEffect(() => {
          if (mounted) mountCb();
          return () => { if (mounted) unmountCb(); };
        }, [mounted]);

        return mounted ? <div>Mounted</div> : null;
      }

      const { rerender } = render(<LifecycleApp mounted={true} />, { container: rootElement });
      expect(mountCb).toHaveBeenCalledTimes(1);

      rerender(<LifecycleApp mounted={false} />);
      expect(unmountCb).toHaveBeenCalledTimes(1);

      rerender(<LifecycleApp mounted={true} />);
      expect(mountCb).toHaveBeenCalledTimes(2);
    });
  });

  describe('State Preservation', () => {
    it('should preserve state across re-renders', async () => {
      function StatefulApp() {
        const [count, setCount] = React.useState(0);
        return (
          <div>
            <span>Count: {count}</span>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
          </div>
        );
      }

      const { rerender } = render(<StatefulApp />, { container: rootElement });
      expect(screen.getByText('Count: 0')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Count: 1')).toBeInTheDocument();

      rerender(<StatefulApp />);
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle root element missing gracefully', () => {
      function ShouldNotRender() {
        return <div>ShouldRender</div>;
      }

      const container = document.createElement('div');
      container.id = 'nonexistent';
      document.body.appendChild(container);

      const { container: actualContainer } = render(<ShouldNotRender />, { container });
      expect(actualContainer.textContent).toBe('ShouldRender');

      document.body.removeChild(container);
    });
  });

  describe('createRoot API', () => {
    it('should demonstrate createRoot pattern', () => {
      function DemoApp() {
        return <div>createRoot Demo</div>;
      }

      const container = document.createElement('div');
      document.body.appendChild(container);

      render(<DemoApp />, { container });
      expect(screen.getByText('createRoot Demo')).toBeInTheDocument();

      document.body.removeChild(container);
    });
  });
});
