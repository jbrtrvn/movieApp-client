import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/movies/addMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, director, year, description, genre }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add movie");
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Movie added successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/movies");
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <Button
        variant="outline-secondary"
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        <i className="bi bi-arrow-left"></i> Back
      </Button>

      {/* Add Movie Form */}
      <Form onSubmit={handleSubmit} className="border p-3">
        <h1 className="my-4 text-center">Add Movie</h1>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Director</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Director"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Year</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Genre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Movie
        </Button>
      </Form>
    </div>
  );
};

export default AddMovie;
