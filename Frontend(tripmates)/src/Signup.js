import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '', email: '', username: '', mobileNumber: '', password: ''
    });
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
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        else if (formData.fullName.trim().length < 3) errors.fullName = 'Name must be at least 3 characters';

        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email address';

        if (!formData.username.trim()) errors.username = 'Username is required';
        else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters';
        else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) errors.username = 'Only letters, numbers and underscore allowed';

        if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) errors.mobileNumber = 'Enter a valid 10-digit Indian mobile number';

        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        else if (!/(?=.*[A-Z])/.test(formData.password)) errors.password = 'Password must have at least one uppercase letter';
        else if (!/(?=.*\d)/.test(formData.password)) errors.password = 'Password must have at least one number';

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
            const res = await axios.post('http://localhost:5001/api/signup', formData);
            onLogin(res.data.user);
            navigate('/feed');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong!");
        }
    };

    const inputStyle = (field) => ({
        padding: '14px', borderRadius: '12px', width: '100%', boxSizing: 'border-box',
        border: `1px solid ${fieldErrors[field] ? '#ff7675' : '#dfe6e9'}`,
        background: 'white', outline: 'none', fontSize: '15px', fontFamily: 'Poppins, sans-serif'
    });

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
                background: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '30px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4)', width: '90%', maxWidth: '450px',
                textAlign: 'center', zIndex: 10, backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.4)', boxSizing: 'border-box'
            }}>
                <h2 style={{ color: '#2d3436', marginBottom: '8px', fontWeight: '800', fontSize: '28px' }}>Join TripMates!</h2>
                <p style={{ color: '#636e72', marginBottom: '25px', fontSize: '14px' }}>Start your journey with us today!</p>

                {error && <p style={{ color: '#ff7675', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} style={inputStyle('fullName')} />
                        {fieldErrors.fullName && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.fullName}</p>}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} style={inputStyle('email')} />
                        {fieldErrors.email && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.email}</p>}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input type="text" name="username" placeholder="Creative Username" onChange={handleChange} style={inputStyle('username')} />
                        {fieldErrors.username && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.username}</p>}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} style={inputStyle('mobileNumber')} />
                        {fieldErrors.mobileNumber && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.mobileNumber}</p>}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle('password')} />
                        {fieldErrors.password && <p style={{ color: '#ff7675', fontSize: '12px', margin: '4px 0 0 4px' }}>{fieldErrors.password}</p>}
                    </div>

                    <button type="submit" style={{
                        background: 'linear-gradient(135deg, #c9a84c, #e8c46a)',
                        color: '#2d1a00', border: 'none', padding: '15px',
                        borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(201,168,76,0.5)', marginTop: '10px',
                        fontFamily: 'Poppins, sans-serif'
                    }}>Start Your Journey</button>
                </form>

                <p style={{ marginTop: '25px', color: '#636e72', fontSize: '14px' }}>
                    Already a TripMate? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: brandTeal, fontWeight: 'bold' }}>Login here</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;