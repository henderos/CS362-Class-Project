import { render, screen } from '@testing-library/react';
import BudgetTool from '../components/BudgetTool';

test('renders budget tool component', () => {
  render(<BudgetTool />);
  expect(screen.getByText(/Set Your Budget/)).toBeInTheDocument();
});
