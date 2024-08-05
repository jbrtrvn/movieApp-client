import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../UserContext';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/movies/getMovies`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setMovies(data.movies || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <Spinner animation="border" />; 
    if (error) return <Alert variant="danger">Error: {error}</Alert>; 

    return (
        <div>
            <h1 className="my-5 text-center">Movies Catalog</h1>
            <Row>
                {movies.map(movie => (
                    <Col md={4} key={movie._id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text>
                                    <strong>Director:</strong> {movie.director} <br />
                                    <strong>Year:</strong> {movie.year} <br />
                                    <strong>Genre:</strong> {movie.genre} <br />
                                    <strong>Description:</strong> {movie.description}
                                </Card.Text>
                                {user.id && (
                                    <Link to={`/movies/${movie._id}`} className="btn btn-primary">View Details</Link>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Movies;
