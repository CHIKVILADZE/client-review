import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../context/authContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactSwitch from 'react-switch';
import { ThemeContext } from '../App';

function TextLink({ t, handleChangeLanguage, currentUserId }) {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { theme, toogleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    localStorage.removeItem('accessToken');

    try {
      await axios.post(
        'https://review-platform-ql9e.onrender.com/api/auth/logout'
      );

      setCurrentUser(null);

      sessionStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar className="main">
      <Container>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <Navbar.Brand className="main" href="/">
              {t('navbar.homeLink')}
            </Navbar.Brand>
          </div>
          <div className="switch">
            <ReactSwitch onChange={toogleTheme} checked={theme === 'dark'} />
          </div>
          <div
            className=" d-flex   justify-content-between"
            style={{ width: '330px' }}
          >
            <Button variant="light" onClick={() => handleChangeLanguage('en')}>
              En
            </Button>
            <Button variant="light" onClick={() => handleChangeLanguage('ge')}>
              Ge
            </Button>
            {currentUser && currentUser.isAdmin === true ? (
              <Link to={`/dashboard/${currentUserId}`} className="mr-1">
                <button className="btn btn-success mb-1">Admin</button>{' '}
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
