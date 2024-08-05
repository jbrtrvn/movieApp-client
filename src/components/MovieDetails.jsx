import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import ManageMovie from "./ManageMovie";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");

  const fetchMovie = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/getMovie/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const navigateCommentList = () => {
    navigate(`/comments/${id}`);
  };

  const handleComment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/addComment/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ comment }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      Swal.fire({
        title: "Comment Added",
        icon: "success",
        text: "Your comment has been added.",
      });
      setComment("");
      fetchMovie(); 
    } catch (err) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: err.message,
      });
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return movie ? (
    <div className="container mt-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        <i className="bi bi-arrow-left"></i> Back
      </Button>
      <Card>
        <Card.Body>
          {user.id && user.isAdmin === false && (
            <>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>
                <strong>Director:</strong> {movie.director} <br />
                <strong>Year:</strong> {movie.year} <br />
                <strong>Genre:</strong> {movie.genre} <br />
                <strong>Description:</strong> {movie.description}
              </Card.Text>
              
              <Form onSubmit={handleComment} className="d-flex flex-column">
                <Form.Group className="mb-3">
                  <Form.Label>Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your comment here..."
                  />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                  <Button variant="success" onClick={navigateCommentList}>
                    View Comments
                  </Button>
                </div>
              </Form>
            </>
          )}
          
          {user.id && user.isAdmin === true && (
            <>
              <Card className="mt-4">
                <Card.Body>
                  <Card.Title>Comments</Card.Title>
                  {movie.comments.length > 0 ? (
                    <ul className="list-unstyled">
                    {movie.comments.map((item, index) => { 
                      return (
                        <li key={index} className="border-bottom pb-2 mb-2">
                          {item.comment}
                        </li>
                      );
                    })}
                  </ul>
                  
                  ) : (
                    <p>No comments available.</p>
                  )}
                </Card.Body>
              </Card>
              <ManageMovie className="mt-4" />
            </>
          )}
          
        </Card.Body>
      </Card>
    </div>
  ) : (
    <div>No movie data available.</div>
  );
};

export default MovieDetails;
