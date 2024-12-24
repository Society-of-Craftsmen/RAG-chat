import React from 'react';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import IndexPage from '@/pages';

describe('Index page', () => {
    it('Should render properly', () => {
        render(<IndexPage />);
        const header = screen.getByRole('heading');
        const headerText = 'Hello World';
        expect(header).toHaveTextContent(headerText);
    });
});