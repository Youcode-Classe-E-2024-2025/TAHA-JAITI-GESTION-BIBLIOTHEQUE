import { useCallback, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";


const useAuthController = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login, logout } = useAuthStore();

    // const handleLogin = async (email: string, password: string) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await authService.login({ email, password });
    //         if (response.data.data) {
    //             login(response.data.data);
    //         }

    //         navigate('/');
    //     } catch (err: unknown) {
    //         setError('Login failed, Invalid credentials' + err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const handleLogin = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login({ email, password });

            if (response.data.data) {
                login(response.data.data.access_token);
                navigate('/');
            } else {
                setError('Login failed, please try again');
            }
        } catch (err: unknown) {
            console.log(err);
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    }, [login, navigate]);


    // const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await authService.register({ name, email, password, password_confirmation });
    //         if (response.data.data) {
    //             login(response.data.data);
    //         }
    //         navigate('/');
    //     } catch (err: unknown) {
    //         setError('Registration failed' + err);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const register = useCallback(async (name: string, email: string, password: string, password_confirmation: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register({ name, email, password, password_confirmation });

            if (response.data.data) {
                login(response.data.data.access_token);
                navigate('/');
            } else {
                setError('Registering failed, please try again');
            }
        } catch (err: unknown) {
            setError(err.message || 'Register failed');
        } finally {
            setLoading(false);
        }
    }, [login, navigate]);


    const handleLogout = useCallback(async () => {
        await authService.logout();
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return {
        loading,
        error,
        handleLogin,
        register,
        handleLogout
    }
}

export default useAuthController;