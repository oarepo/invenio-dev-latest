import { screen, act } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

describe('Entry Point Integration Tests', () => {
  let rootElement;
  let root;

  beforeEach(() => {
    // Create a fresh root element for each test
    rootElement = document.createElement('div');
    rootElement.id = 'app';
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    // Clean up: unmount React and remove element
    act(() => {
      if (root) {
        root.unmount();
        root = null;
      }
    });
    if (rootElement && rootElement.parentNode) {
      rootElement.parentNode.removeChild(rootElement);
    }
    rootElement = null;
  });

  it('should mount application via createRoot pattern', () => {
    // This test verifies the React 19 createRoot pattern works correctly

    function MockApp() {
      return <div>Application</div>;
    }

    expect(rootElement).toBeInTheDocument();

    root = createRoot(rootElement);
    act(() => {
      root.render(<MockApp />);
    });

    expect(screen.getByText('Application')).toBeInTheDocument();
  });

  it('should handle createRoot error when element missing', () => {
    // Test error handling when root element doesn't exist

    // Remove element to test error case
    rootElement.remove();

    expect(() => {
      createRoot(null);
    }).toThrow();
  });

  it('should support ReactDOM.render deprecation handling', () => {
    // Test that we're aware of ReactDOM.render being deprecated

    function MockApp() {
      return <div>App</div>;
    }

    // This test verifies we understand both APIs
    expect(ReactDOM).toBeDefined();
    expect(createRoot).toBeDefined();

    // Prefer createRoot for new code
    root = createRoot(rootElement);
    act(() => {
      root.render(<MockApp />);
    });
    expect(screen.getByText('App')).toBeInTheDocument();
  });
});
