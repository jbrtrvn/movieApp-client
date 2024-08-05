import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

const UpdateMovie = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/getMovie/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch movie details");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMovie(data);
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/movies/updateMovie/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(movie),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update movie");
        }
        return res.json();
      })
      .then(() => {
        Swal.fire('Success', 'Movie updated successfully', 'success')
          .then(() => navigate("/movies"));
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/movies/deleteMovie/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to delete movie");
            }
            return res.json();
          })
          .then(() => {
            Swal.fire('Deleted!', 'Movie has been deleted.', 'success')
              .then(() => navigate("/movies"));
          })
          .catch((err) => Swal.fire('Error', err.message, 'error'));
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="my-4 text-center">Update Movie</h1>
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
      <Button variant="primary" type="submit" className="p-2 m-1">
        Update Movie
      </Button>
      <Button variant="danger" onClick={handleDelete} className="p-2 m-1">
        Delete Movie
      </Button>
    </Form>
  );
};

export default UpdateMovie;
