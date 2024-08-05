import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsActive(name && email && password && confirmPassword && password === confirmPassword);
    }, [name, email, password, confirmPassword]);

    const handleRegister = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered successfully") {
                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "You have successfully registered."
                });
                navigate('/login');
            } else {
                Swal.fire({
                    title: "Registration Failed",
                    icon: "error",
                    text: "An error occurred during registration."
                });
            }
        });
    };

    return (
        <Form onSubmit={handleRegister} className='border p-3'>
            <h1 className="my-4 text-center">Register</h1>
            <Form.Group className="mb-2">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!isActive}>Register</Button>
        </Form>
    );
};

export default Register;
