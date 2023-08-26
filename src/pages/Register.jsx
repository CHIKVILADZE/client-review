import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Register() {
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4000/api/auth/register', inputs);
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <h1 className="mb-4">Register</h1>
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
              onClick={handleClick}
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
