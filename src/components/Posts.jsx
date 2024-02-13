import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Search from './Search';

function Posts({ t }) {
  const { postId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get('https://review-platform-ql9e.onrender.com/api/posts')
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
      <Search postId={postId} />

      <div className="container my-5" style={{ width: '45%' }}>
        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div key={post.id} className="card mb-3 main ">
                <div className=" main card-body text-center">
                  {post.author && (
                    <div className="main">
                      <Link
                        to={`/userpage/${post.id}`}
                        className="text-decoration-none fs-5 text-info"
                      >
                        {post.author.firstName}&nbsp;{post.author.lastName}
                      </Link>
                      <h5 className=" card-subtitle mb-2  mt-2">
                        {post.title}
                      </h5>
                      <div>
                        {' '}
                        <img
                          src={`https://review-platform-ql9e.onrender.com/images/${post.image}`}
                          alt=""
                          className="img-fluid"
                          style={{ width: '90%' }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="card-text mt-4">{post.desc}</p>
                </div>

                <div className="card-footer d-flex">
                  <div className="ml-auto">
                    <Link
                      to={`/post/${post.id}`}
                      className="btn btn-primary text-white"
                    >
                      {t('home.body')}
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
