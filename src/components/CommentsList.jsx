import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const CommentsList = () => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/movies/getComments/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return res.json();
            })
            .then(data => setComments(data.comments || []))
            .catch(err => setError(err.message));
    }, [id]);

    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <div>
            <h2 className="my-4 text-center">Comments</h2>
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment, index) => (
                    <div key={index} className="border p-3 mb-2">
                        {comment}
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentsList;
