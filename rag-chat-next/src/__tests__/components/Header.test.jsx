import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import '@testing-library/jest-dom'

test('renders the header component with welcome message in heading and header', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();

    const headingElement = screen.getByRole('heading', { name: /Welcome to/i });
    expect(headingElement).toBeInTheDocument();

    const spanElement = screen.getByText(/RAG-chat/i);
    expect(spanElement).toBeInTheDocument();
});
