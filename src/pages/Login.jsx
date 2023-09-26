import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

export default function Login({ t }) {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const [err, setErr] = useState(null);
  const { setCurrentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');

    try {
      const res = await axios.post(
        'http://localhost:4000/api/auth/login',
        inputs,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.Login) {
        localStorage.setItem('accessToken', res.data.token);
        console.log('RESSS DATAAA', res.data.others);
        setCurrentUser(res.data.others);
        navigate('/');
      } else {
        setErr('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.log(error);
      setErr('An error occurred during login.');
    }
  };

  const googleButton = () => {
    window.open(
      'https://server-review.onrender.com/auth/google/callback',
      '_self'
    );
  };
  const githubButton = () => {
    window.open(
      'https://server-review.onrender.com/auth/github/callback',
      '_self'
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <h1 className="mb-4">{t('home.login')}</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                style={{ width: '300px', height: '30px' }}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                style={{ width: '300px', height: '30px' }}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {t('home.login')}
            </button>
          </form>
          <br />
          <div>
            <Link to="/register"> {t('home.register')}</Link>
          </div>
          {/* <div className="col-4">
            <div
              className="btn btn-secondary mt-3"
              onClick={(login) => googleButton(login)}
            >
              Sith In With Google
            </div>
            <div className="btn btn-secondary mt-3" onClick={githubButton}>
              Sith In With Github
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
