import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './button';

test('renders learn react link', () => {
  render(<Button sfHost='' inInspector/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
