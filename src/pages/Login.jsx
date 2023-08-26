import React from 'react';
import { AuthContext } from '../context/authContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const [errorState, setErrorState] = useState(null);

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
      setErrorState(err.response.data);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <h1 className="mb-4">Login</h1>
          <form>
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
              {errorState && (
                <p className="text-danger mt-3">{errorState.error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
