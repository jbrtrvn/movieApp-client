import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { UserProvider } from "./UserContext";
import AppNavbar from "./components/AppNavbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./components/Movies";
import MovieDetails from "./components/MovieDetails";
import Logout from "./pages/Logout";
import AddMovie from "./components/AddMovie";
import DeleteMovie from "./components/DeleteMovie";
import CommentsList from "./components/CommentsList";
import UpdateMovie from "./components/UpdateMovie";

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch user details:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ id: null, isAdmin: false });
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser: handleLogout }}>
      <Router>
        <AppNavbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/deleteMovie" element={<DeleteMovie />} />
            <Route path="/update-movie/:id" element={<UpdateMovie />} />
            <Route path="/movies/:id/comments" element={<CommentsList />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
