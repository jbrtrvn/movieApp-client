import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateMovie = () => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/movies/getMovie/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                return res.json();
            })
            .then(data => {
                console.log(data)
                setMovie(data)
            })
            .catch(err => setError(err.message));
    }, [id]);
    
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_URL}/movies/updateMovie/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(movie),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update movie');
                }
                return res.json();
            })
            .then(() => {
                setSuccess('Movie updated successfully');
                setTimeout(() => navigate('/movies'), 2000);
            })
            .catch(err => setError(err.message));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie(prev => ({ ...prev, [name]: value }));
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <Form onSubmit={handleSubmit} className='border p-3'>
            <h1 className="my-4 text-center">Update Movie</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={movie.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Director</Form.Label>
                <Form.Control
                    type="text"
                    name="director"
                    value={movie.director}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Year</Form.Label>
                <Form.Control
                    type="number"
                    name="year"
                    value={movie.year}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={movie.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                    type="text"
                    name="genre"
                    value={movie.genre}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">Update Movie</Button>
        </Form>
    );
};

export default UpdateMovie;
