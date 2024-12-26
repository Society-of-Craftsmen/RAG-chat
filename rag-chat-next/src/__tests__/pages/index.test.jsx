import React from 'react';
import { render, screen, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import HomePage from '@/pages/index';

// Mock the useRouter hook from next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('Index page', () => {
    it('Should render file upload input', async () => {
        // Mock the useRouter function
        const mockPush = jest.fn();
        require('next/navigation').useRouter.mockReturnValue({
            push: mockPush,
        });
        await act(async () => {
            render(<HomePage />);
        });
        const inputBTN = screen.getByTestId('file-input');
        expect(inputBTN).toBeInTheDocument();
        const submitBTN = screen.queryByTestId('button');
        expect(submitBTN).not.toBeInTheDocument();
    });
});