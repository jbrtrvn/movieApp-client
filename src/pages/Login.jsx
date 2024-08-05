import React, { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const Login = () => {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "You are now logged in."
                });
                navigate('/movies');
            } else {
                Swal.fire({
                    title: "Login Failed",
                    icon: "error",
                    text: data.message || "An error occurred."
                });
            }
        });
    };

    const retrieveUserDetails = (token) => {
        fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        });
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    if (user.id) {
        return <Navigate to="/movies" />;
    }

    return (
        <>
            <h1 className="my-5 text-center">Login</h1>
            <Form onSubmit={handleLogin} className='border p-3'>
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={!isActive}>Login</Button>
            </Form>
            <div className='text-center py-3'>
                <p>Don't have an account yet? <Link to="/register">Register here</Link></p>
            </div>
        </>
    );
};

export default Login;
