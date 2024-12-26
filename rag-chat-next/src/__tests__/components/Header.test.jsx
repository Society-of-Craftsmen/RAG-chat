import { render, screen, act } from '@testing-library/react';
import Header from '../../components/Header';
import '@testing-library/jest-dom'

// Mock the useRouter hook from next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe("Test Header component", () => {
    it("renders the header component with welcome message", async () => {
        // Mock the useRouter function
        const mockPush = jest.fn();
        require('next/navigation').useRouter.mockReturnValue({
            push: mockPush,
        });
        
        await act(async () => {
            render(<Header />);
        });

        const headerElement = screen.getByRole('banner');
        expect(headerElement).toBeInTheDocument();

        const headingElement = screen.getByRole('heading', { name: /Welcome to/i });
        expect(headingElement).toBeInTheDocument();

        const spanElement = screen.getByText(/RAG-chat/i);
        expect(spanElement).toBeInTheDocument();
    });
});