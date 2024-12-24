import { render, screen } from '@testing-library/react';
import TestComponent from '../../components/TestComponent';
import '@testing-library/jest-dom'

test('renders TestComponent', () => {
    render(<TestComponent />);
    const element = screen.getByText(/This is test element/i); // Adjust based on your component
    expect(element).toBeInTheDocument();
});



