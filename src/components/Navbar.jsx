import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../context/authContext';
import { Link, useParams } from 'react-router-dom';

function TextLink({ t, handleChangeLanguage, currentUserId }) {
  const { currentUser } = useContext(AuthContext);
  const handleLogout = async () => {
    localStorage.clear();
    window.open('https://server-review.onrender.com/auth/logout', '_self');
  };

  console.log('cNAvbar Current', currentUser);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <div className="d-flex justify-content-between align-items-center w-100">
          {' '}
          <div>
            <Navbar.Brand href="/">{t('navbar.homeLink')}</Navbar.Brand>{' '}
          </div>
          <div>
            <Button variant="light" onClick={() => handleChangeLanguage('en')}>
              En
            </Button>
            <Button variant="light" onClick={() => handleChangeLanguage('ge')}>
              Ge
            </Button>
            {currentUser && currentUser.isAdmin === true ? (
              <Link to={`/dashboard/${currentUserId}`} className="mr-1">
                <button>Admin</button>
              </Link>
            ) : null}
            &nbsp;
            {currentUser && currentUser.firstName ? (
              <div className="d-flex align-items-center">
                <Link to="/profile" className="nav-link">
                  {currentUser.firstName}
                </Link>
                &nbsp;
                <Button variant="danger" onClick={handleLogout}>
                  {' '}
                  {t('navbar.logout')}
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Link to="/login" className="nav-link">
                  {t('navbar.login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default TextLink;
