import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Register({ t }) {
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    authMethod: 'custom',
  });
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        inputs
      );
      navigate('/login');
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <h1 className="mb-4">{t('home.register')}</h1>
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                style={{ width: '300px', height: '30px' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                style={{ width: '300px', height: '30px' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                style={{ width: '300px', height: '30px' }}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                style={{ width: '300px', height: '30px' }}
              />
              {error && <p className="text-danger mt-3">{error.error}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
