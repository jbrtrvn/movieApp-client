import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const AddComment = () => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { id } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(${import.meta.env.VITE_API_URL}/movies/addComment/${id}, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: Bearer ${localStorage.getItem('token')},
            },
            body: JSON.stringify({ comment }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to add comment');
                }
                return res.json();
            })
            .then(() => {
                setSuccess('Comment added successfully');
                setComment('');
            })
            .catch(err => setError(err.message));
    };

    return (
        <Form onSubmit={handleSubmit} className='border p-3'>
            <h1 className="my-4 text-center">Add Comment</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Group className="mb-2">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">Add Comment</Button>
        </Form>
    );
};

export default AddComment;