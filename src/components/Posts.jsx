import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { makeRequest } from '../axios';

function Posts({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    makeRequest
      .get('/posts')
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);
  console.log('dataaa', data);

  if (isLoading) {
    return (
      <div className="container my-5" style={{ width: '45%' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleLogout = async () => {
    window.open('http://localhost:4000/auth/logout', '_self');
  };
  console.log();

  return (
    <div className="container my-5" style={{ width: '45%' }}>
      <button onClick={handleLogout}>Log Out</button>
      {user && user.firstName && (
        <div>
          <h1>{user.firstName}</h1>
        </div>
      )}
      {data && data.length > 0 ? (
        <div>
          {data.map((post) => (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <h2 className="card-title">{post.author.firstName}</h2>
                <h5>{post.title}</h5>
                <p className="card-text">{post.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No posts available.</div>
      )}
    </div>
  );
}
export default Posts;
