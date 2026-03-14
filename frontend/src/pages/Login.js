import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faLock, faGraduationCap, faShieldAlt, 
    faEye, faEyeSlash 
} from '@fortawesome/free-solid-svg-icons';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('remembered_username');
        if (savedUser) {
            setUsername(savedUser);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password);
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('remembered_username', username);
                } else {
                    localStorage.removeItem('remembered_username');
                }
                navigate('/dashboard');
            } else {
                setError(result.message || 'Invalid username or password.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper bg-light">
            <div className="auth-card shadow-sm bg-white border rounded-3 p-4 p-md-5">
                <div className="text-center mb-4">
                    <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-primary mb-3" />
                    <h3 className="fw-bold">SmartPathshala</h3>
                    <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small fw-bold mb-4">
                        <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Input
                            label="Username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            icon={<FontAwesomeIcon icon={faUser} className="text-muted" />}
                        />
                    </div>

                    <div className="mb-3 position-relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            icon={<FontAwesomeIcon icon={faLock} className="text-muted" />}
                        />
                        <button 
                            type="button"
                            className="btn btn-link position-absolute end-0 top-50 translate-middle-y mt-3 me-2 text-muted text-decoration-none shadow-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="sm" />
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="form-check-label small" htmlFor="rememberMe">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="small text-decoration-none">Forgot password?</a>
                    </div>

                    <Button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-bold"
                        loading={loading}
                    >
                        Login
                    </Button>

                    <div className="text-center mt-4 pt-3 border-top">
                        <p className="small text-muted mb-0">© 2026 SmartPathshala</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
