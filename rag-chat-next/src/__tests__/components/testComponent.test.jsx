import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import TestComponent from "../../components/testComponent";

describe("Test Component",() => {
    it("renders an element", () => {
        render(<TestComponent/>);

        const element = screen.getByText("This is test element");
        expect(element).toBeInTheDocument();
    });
});