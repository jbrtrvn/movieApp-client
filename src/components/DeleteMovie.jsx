import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DeleteMovie = ({ id }) => {
    const navigate = useNavigate();
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleDelete = () => {
        fetch(`${import.meta.env.VITE_API_URL}/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to delete movie');
                }
                return res.json();
            })
            .then(() => {
                setSuccess('Movie deleted successfully');
                setTimeout(() => navigate('/movies'), 2000);
            })
            .catch(err => setError(err.message));
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Button variant="danger" onClick={handleDelete}>Delete Movie</Button>
        </>
    );
};

export default DeleteMovie;
