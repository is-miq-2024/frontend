import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../components/LoginPage';
import { useUser } from '../components/UserContext';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../components/UserContext', () => ({
    useUser: jest.fn(),
}));

describe('LoginPage', () => {
    let setUserLogin: jest.Mock;
    let setUserPassword: jest.Mock;
    let navigate: jest.Mock;

    beforeEach(() => {
        setUserLogin = jest.fn();
        setUserPassword = jest.fn();
        navigate = jest.fn();

        (useUser as jest.Mock).mockReturnValue({
            setUserLogin,
            setUserPassword,
        });

        (useNavigate as jest.Mock).mockReturnValue(navigate);
    });

    test('renders the login form', () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        expect(screen.getByLabelText(/Юзернейм/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();
    });

    test('updates input values when typed', () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        const usernameInput = screen.getByLabelText(/Юзернейм/i);
        const passwordInput = screen.getByLabelText(/Пароль/i);

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('password123');
    });

    test('submits the form and calls API', async () => {
        const mockResponse = { userId: 1 };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        render(
            <Router>
                <LoginPage />
            </Router>
        );

        const usernameInput = screen.getByLabelText(/Юзернейм/i);
        const passwordInput = screen.getByLabelText(/Пароль/i);
        const submitButton = screen.getByRole('button', { name: /Войти/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://193.32.178.205:8080/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: 'testuser', password: 'password123' }),
                })
            );
        });

        expect(setUserLogin).toHaveBeenCalledWith('testuser');
        expect(setUserPassword).toHaveBeenCalledWith('password123');

        expect(navigate).toHaveBeenCalledWith('/');
    });

    test('handles failed login request', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({}),
        });

        render(
            <Router>
                <LoginPage />
            </Router>
        );

        const usernameInput = screen.getByLabelText(/Юзернейм/i);
        const passwordInput = screen.getByLabelText(/Пароль/i);
        const submitButton = screen.getByRole('button', { name: /Войти/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://193.32.178.205:8080/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: 'testuser', password: 'password123' }),
                })
            );
        });

        expect(setUserLogin).not.toHaveBeenCalled();
        expect(setUserPassword).not.toHaveBeenCalled();
    });
});
