import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`, config);
                    // Support both standard { data: { user } } and direct { user }
                    const userData = data?.data?.user || data?.user || data;
                    setUser(userData);
                } catch (error) {
                    console.error("Auth Check Failed", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            // Extract payload supporting both formats
            const payload = res.data?.data || res.data;
            const token = payload.token || res.data.token;
            
            if (token) {
                localStorage.setItem('token', token);
                setUser(payload);
                toast.success(`Welcome back, ${payload.name}!`);
                return true;
            } else {
                toast.error(res.data?.message || 'Login failed: No token received');
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed: Invalid credentials');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
            const payload = res.data?.data || res.data;
            const token = payload.token || res.data.token;

            if (token) {
                localStorage.setItem('token', token);
                setUser(payload);
                toast.success(`Registration successful! Welcome, ${payload.name}`);
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
