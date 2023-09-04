import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

function TextLink() {
  const { currentUser } = useContext(AuthContext);
  const handleLogout = async () => {
    localStorage.clear();
    window.open('http://localhost:4000/auth/logout', '_self');
  };
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Review Platform</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {currentUser && currentUser.firstName ? (
              <>
                <a href="/profile">{currentUser.firstName}</a>
                <button onClick={handleLogout}>LogOut</button>
              </>
            ) : (
              <Link to="/login">Log In</Link>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TextLink;
