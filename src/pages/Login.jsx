import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { t } from 'i18next';

export default function Login({ t }) {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate('/');
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const googleButton = () => {
    window.open('http://localhost:4000/auth/google/callback', '_self');
  };
  const githubButton = () => {
    window.open('http://localhost:4000/auth/github/callback', '_self');
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <h1 className="mb-4">{t('home.login')}</h1>
          <form>
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

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              {t('home.login')}
            </button>
          </form>
          <div className="col-4">
            <div
              className="btn btn-secondary mt-3"
              onClick={(login) => googleButton(login)}
            >
              Sith In With Google
            </div>
            <div className="btn btn-secondary mt-3" onClick={githubButton}>
              Sith In With Github
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
