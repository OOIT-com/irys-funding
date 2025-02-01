import React from 'react';
import { render, screen } from '@testing-library/react';
import { FundingIrysDApp } from './FundingIrysDApp';

test('renders learn react link', () => {
  render(<FundingIrysDApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
