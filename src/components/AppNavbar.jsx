import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { FaFilm } from 'react-icons/fa';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className="bg-dark p-4">
            <Container>
                <Navbar.Brand as={Link} to="/" className="text-white fs-2">
                    <FaFilm className="me-2" />
                    MovieCatalog
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user.id ? (
                            user.isAdmin ? (
                                <>
                                    <Nav.Link as={Link} to="/add-movie" className="text-white">
                                        Add Movie
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/logout" className="text-white">
                                        Logout
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/logout" className="text-white">
                                        Logout
                                    </Nav.Link>
                                </>
                            )
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-white">
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="text-white">
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
