import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

function TextLink() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Review Platform</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {currentUser && currentUser.firstName ? (
              <a href="/userprofile">
                {currentUser.firstName}
                <button> Log Out</button>
              </a>
            ) : (
              <a href="/login">Sign In</a>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TextLink;
