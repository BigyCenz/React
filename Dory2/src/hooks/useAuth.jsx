import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const { user, login, logout } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return {
        isAuthenticated,
        user,
        handleLogin,
        handleLogout,
    };
};

export default useAuth;