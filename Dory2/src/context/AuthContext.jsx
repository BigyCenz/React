import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- usa questo al posto di useHistory
import { loginUser, registerUser, logoutUser } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // <-- corretto

    const login = async (credentials) => {
        try {
            const userData = await loginUser(credentials);
            setUser(userData);
            navigate('/'); // Redirect to home
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const register = async (userData) => {
        try {
            await registerUser(userData);
            await login(userData); // Auto-login
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        navigate('/login'); // Redirect to login
    };

    useEffect(() => {
        const checkUserSession = async () => {
            // TODO: Implementa controllo sessione se necessario
        };
        checkUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook per usare il contesto
export const useAuth = () => {
    return useContext(AuthContext);
};
