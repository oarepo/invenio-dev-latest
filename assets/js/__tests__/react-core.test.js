import { render, screen, act, renderHook } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('React Core Features - Baseline Tests', () => {
  describe('useState', () => {
    it('should update state and re-render', () => {
      function Counter() {
        const [count, setCount] = React.useState(0);
        return (
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
        );
      }
      const { container } = render(<Counter />);
      expect(container.textContent).toBe('Count: 0');

      const button = screen.getByRole('button');
      userEvent.click(button);
      expect(container.textContent).toBe('Count: 1');
    });

    it('should support functional updates', () => {
      const { result } = renderHook(() => React.useState(0));
      act(() => result.current[1](c => c + 1));
      expect(result.current[0]).toBe(1);
    });
  });

  describe('useEffect', () => {
    it('should run effect on mount', () => {
      const effectCb = jest.fn();
      function EffectComponent() {
        React.useEffect(effectCb, []);
        return <div>Effect</div>;
      }
      render(<EffectComponent />);
      expect(effectCb).toHaveBeenCalledTimes(1);
    });

    it('should cleanup effects correctly', () => {
      const cleanupCb = jest.fn();

      function EffectComponent({ show }) {
        React.useEffect(() => {
          return cleanupCb;
        }, [show]);
        return show ? <div>Show</div> : null;
      }

      const { rerender } = render(<EffectComponent show={true} />);

      rerender(<EffectComponent show={false} />);
      expect(cleanupCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMemo', () => {
    it('should memoize values', () => {
      const expensiveCalc = jest.fn(x => x * 2);

      function MemoComponent({ val }) {
        const doubled = React.useMemo(() => expensiveCalc(val), [val]);
        return <div>{doubled}</div>;
      }

      const { rerender } = render(<MemoComponent val={5} />);
      expect(expensiveCalc).toHaveBeenCalledTimes(1);
      expect(screen.getByText('10')).toBeInTheDocument();

      rerender(<MemoComponent val={5} />);
      expect(expensiveCalc).toHaveBeenCalledTimes(1);

      rerender(<MemoComponent val={6} />);
      expect(expensiveCalc).toHaveBeenCalledTimes(2);
    });
  });

  describe('useCallback', () => {
    it('should memoize callbacks', () => {
      const callback = jest.fn();

      function CallbackComponent({ count }) {
        const handleClick = React.useCallback(() => callback(count), [count]);
        return <button onClick={handleClick}>Click</button>;
      }

      const { rerender } = render(<CallbackComponent count={1} />);
      const button = screen.getByRole('button');
      button.click();
      expect(callback).toHaveBeenCalledWith(1);

      rerender(<CallbackComponent count={2} />);
      button.click();
      expect(callback).toHaveBeenCalledWith(2);
    });
  });

  describe('Context API', () => {
    it('should provide and consume context', () => {
      const TestContext = React.createContext('default');

      function Provider({ children }) {
        return (
          <TestContext.Provider value="provided">
            {children}
          </TestContext.Provider>
        );
      }

      function Consumer() {
        const value = React.useContext(TestContext);
        return <div>{value}</div>;
      }

      render(
        <Provider>
          <Consumer />
        </Provider>
      );
      expect(screen.getByText('provided')).toBeInTheDocument();
    });
  });

  describe('Refs', () => {
    it('should work with useRef', () => {
      function RefComponent() {
        const inputRef = React.useRef(null);

        const handleClick = () => {
          inputRef.current?.focus();
        };

        return (
          <div>
            <input ref={inputRef} />
            <button onClick={handleClick}>Focus</button>
          </div>
        );
      }

      const focusMock = jest.fn();
      HTMLInputElement.prototype.focus = focusMock;

      render(<RefComponent />);
      screen.getByRole('button').click();
      expect(focusMock).toHaveBeenCalled();
    });

    it('should work with callback refs', () => {
      const refCb = jest.fn();

      function CallbackRefComponent() {
        return <div ref={refCb}>Content</div>;
      }

      render(<CallbackRefComponent />);
      expect(refCb).toHaveBeenCalled();
      expect(refCb.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Event Handling', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();

      function Button() {
        return <button onClick={handleClick}>Click me</button>;
      }

      render(<Button />);
      userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle form submit', () => {
      const handleSubmit = jest.fn(e => e.preventDefault());

      function Form() {
        return (
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
          </form>
        );
      }

      render(<Form />);
      screen.getByRole('button').click();
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
