import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const brandTeal = '#00d2d3';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    };

    const validate = () => {
        const errors = {};
        if (!formData.username.trim()) errors.username = 'Username is required';
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        try {
            const response = await axios.post('http://localhost:5001/api/login', formData);
            onLogin(response.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials!");
        }
    };

    return (
        <div style={{
            height: '100vh', width: '100vw', position: 'relative',
            overflow: 'hidden', display: 'flex', justifyContent: 'center',
            alignItems: 'center', fontFamily: 'Poppins, sans-serif'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2000&q=80')`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'none', opacity: 1, zIndex: 0
            }}></div>

            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.35)', zIndex: 1
            }}></div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)', width: '90%', maxWidth: '400px',
                textAlign: 'center', zIndex: 10, backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
                <h2 style={{ color: '#2d3436', marginBottom: '8px', fontWeight: '800' }}>Welcome Back!</h2>
                <p style={{ color: '#636e72', marginBottom: '25px', fontSize: '14px' }}>Ready for your next adventure?</p>

                {error && <p style={{ color: '#ff7675', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <input
                            type="text" name="username" placeholder="Username"
                            value={formData.username} onChange={handleChange}
                            style={{
                                padding: '14px', borderRadius: '12px', width: '100%', boxSizing: 'border-box',
                                border: `1px solid ${fieldErrors.username ? '#ff7675' : '#dfe6e9'}`,
                                background: 'white', outline: 'none', fontFamily: 'Poppins, sans-serif'
                            }}
                        />
                        {fieldErrors.username && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.username}</p>}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input
                            type="password" name="password" placeholder="Password"
                            value={formData.password} onChange={handleChange}
                            style={{
                                padding: '14px', borderRadius: '12px', width: '100%', boxSizing: 'border-box',
                                border: `1px solid ${fieldErrors.password ? '#ff7675' : '#dfe6e9'}`,
                                background: 'white', outline: 'none', fontFamily: 'Poppins, sans-serif'
                            }}
                        />
                        {fieldErrors.password && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.password}</p>}
                    </div>

                    <button type="submit" style={{
                        background: 'linear-gradient(135deg, #c9a84c, #e8c46a)',
                        color: '#2d1a00', border: 'none', padding: '15px',
                        borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(201,168,76,0.5)', marginTop: '10px',
                        fontFamily: 'Poppins, sans-serif'
                    }}>Let's Dive In!</button>
                </form>

                <p style={{ marginTop: '25px', color: '#636e72', fontSize: '14px' }}>
                    New to TripMates? <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: brandTeal, fontWeight: 'bold' }}>Join us</span>
                </p>
            </div>
        </div>
    );
};

export default Login;