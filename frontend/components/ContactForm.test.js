import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />)
    const headerElement = screen.queryByText(/contact form/i)
    expect(headerElement).toBeInTheDocument()
    expect(headerElement).toBeTruthy()
    expect(headerElement).toHaveTextContent(/contact form/i)

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText('First Name*');
    userEvent.type(firstNameInput, 'Jay');
    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton)
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    
    const firstNameField = screen.getByLabelText(/first name*/i)
    userEvent.type(firstNameField, "Elizabeth")

    const lastNameField = screen.getByLabelText(/last name*/i)
    userEvent.type(lastNameField, "Trione")

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton)

    const errorMessage = await screen.getAllByTestId('errors')
    expect(errorMessage).toHaveLength(1)
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailField = screen.getByLabelText(/email/i)
    userEvent.type(emailField, 'foobar')
    const emailError = await screen.getByText(/email must be a valid email address/i)
    expect(emailError).toBeInTheDocument()
    
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton)
    const lastNameError = await screen.getByText(/lastName is a required field/i)
    expect(lastNameError).toBeInTheDocument()
    
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)

    const firstNameField = screen.getByLabelText(/first name*/i)
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/email*/i)

    userEvent.type(firstNameField, "Elizabeth")
    userEvent.type(lastNameField, "Trione")
    userEvent.type(emailField, "etrione@yahoo.com")

    const button = screen.getByRole("button")
    userEvent.click(button)

    await waitFor(() => {
        const firstNameDisplayed = screen.queryByText("Elizabeth")
        const lastNameDisplayed = screen.queryByText("Trione")
        const emailDisplayed = screen.queryByText("etrione@yahoo.com")
        const messageDisplayed = screen.queryByTestId("messageDisplay")

        expect(firstNameDisplayed).toBeInTheDocument()
        expect(lastNameDisplayed).toBeInTheDocument()
        expect(emailDisplayed).toBeInTheDocument()
        expect(messageDisplayed).not.toBeInTheDocument()
        
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    const firstNameField = screen.getByLabelText(/first name*/i)
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/email*/i)
    const messageField = screen.getByLabelText(/message/i)

    userEvent.type(firstNameField, "Elizabeth")
    userEvent.type(lastNameField, "Trione")
    userEvent.type(emailField, "etrione@yahoo.com")
    userEvent.type(messageField, "this is just a test")

    const button = screen.getByRole("button")
    userEvent.click(button)

    await waitFor(() => {
        const firstNameDisplayed = screen.queryByText("Elizabeth")
        const lastNameDisplayed = screen.queryByText("Trione")
        const emailDisplayed = screen.queryByText("etrione@yahoo.com")
        const messageDisplayed = screen.queryByText("this is just a test")

        expect(firstNameDisplayed).toBeInTheDocument()
        expect(lastNameDisplayed).toBeInTheDocument()
        expect(emailDisplayed).toBeInTheDocument()
        expect(messageDisplayed).toBeInTheDocument()
        
    })

});
