import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import UpdateMovie from "./UpdateMovie";
import DeleteMovie from "./DeleteMovie";

const MovieDetails = () => {
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
      console.log(data);
      if (data) {
        setMovie(data);
      } else {
        setError("No movie details found");
      }
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
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const data = await response.json();
      Swal.fire({
        title: "Comment Added",
        icon: "success",
        text: "Your comment has been added.",
      });
      setComment("");
      await fetchMovie();
    //   // Optionally refetch movie details to include the new comment
    //   const updatedResponse = await fetch(
    //     `${import.meta.env.VITE_API_URL}/movies/getMovie/${id}`
    //   );
    //   const updatedData = await updatedResponse.json();
    //   setMovie(updatedData.movie);
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
    <div>
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
              <Card.Text>
                <strong>Comments:</strong>
                {movie.comments && movie.comments.length > 0 ? (
                  <ul>
                    {movie.comments.map((comment, index) => (
                      <li key={index}>{comment.comment}</li>
                    ))}
                  </ul>
                ) : (
                  <span>No comments yet.</span>
                )}
              </Card.Text>
              <Form onSubmit={handleComment}>
                <Form.Group>
                  <Form.Label>Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </>
          )}
          
          {user.id && user.isAdmin === true && (
            <>
            <UpdateMovie />
            <DeleteMovie id={id} />
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
