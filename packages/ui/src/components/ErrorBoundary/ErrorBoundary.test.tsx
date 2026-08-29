import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BuggyComponent = () => {
  throw new Error('Test Bug');
};

describe('ErrorBoundary component', () => {
  beforeEach(() => {
    // Suppress console.error logs from intentional test failures
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>All Good</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('All Good')).toBeInTheDocument();
  });

  it('renders fallback screen when child component throws', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Application Render Failure')).toBeInTheDocument();
    expect(screen.getByText('Error: Test Bug')).toBeInTheDocument();
  });
});
