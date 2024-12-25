import { render, screen } from '@testing-library/react';
import Header from '../../components/TestComponent';
import '@testing-library/jest-dom'

test('renders the header component with welcome message', () => {
    render(<Header />);
    expect(screen.getByText(/Welcome to RAG-chat/)).toBeInTheDocument();
});
