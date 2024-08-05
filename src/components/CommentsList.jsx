import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const CommentsList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [groupComments, setGroupComments] = useState([]);
    const [error, setError] = useState('');
    
    const groupCommentsByUserId = (comments) => {
        const grouped = {};
    
        comments.forEach(({ userId, ...rest }) => {
            if (!grouped[userId]) {
                grouped[userId] = [];
            }
            grouped[userId].push(rest);
        });
        const groupEntries = Object.entries(grouped).map(([userId, comments]) => ({
            user_id: userId,
            comments: comments
        }));

        setGroupComments(groupEntries);
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/movies/getComments/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch comments');
                }
                
                return res.json();
            })
            .then(data => {
                groupCommentsByUserId(data.comments);
                setComments(data.comments || [])
            })
            .catch(err => setError(err.message));
    }, [id]);

    if (error) return <Alert variant="danger">Error: {error}</Alert>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Back Button */}
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
                <i className="bi bi-arrow-left"></i> Back
            </Button>

            {/* Comments Display */}
            {groupComments.map(({ user_id, comments }) => (
                <div key={user_id} style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <h3 style={{ margin: '0', color: '#333' }}>User ID: {user_id}</h3>
                        <h6 style={{ margin: '0', color: '#666' }}>Comments:</h6>
                    </div>
                    <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                        {comments.map(({ comment, _id }) => (
                            <li key={_id} style={{ borderBottom: '1px solid #ddd', padding: '10px', backgroundColor: '#fff', color: '#333' }}>
                                {comment}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CommentsList;
