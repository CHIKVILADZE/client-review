import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Posts() {
  const { currentUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const { postId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get('http://localhost:4000/api/posts')
      .then((res) => {
        setPosts(
          res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="container my-5" style={{ width: '45%' }}>
        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div key={post.id} className="card mb-3">
                <div className="card-body">
                  {post.author && (
                    <>
                      <h2 className="card-title">{post.author.firstName}</h2>
                      <h5 className="card-subtitle mb-2 text-muted">
                        {post.title}
                      </h5>
                    </>
                  )}
                  <p className="card-text">{post.desc}</p>
                </div>

                <div className="card-footer d-flex">
                  <div className="ml-auto">
                    <Link
                      to={`/post/${post.id}`}
                      className="btn btn-secondary text-white"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">No posts available.</div>
        )}
      </div>
    </div>
  );
}

export default Posts;
