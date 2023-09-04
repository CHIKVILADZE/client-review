import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import Cookies from 'js-cookie';

function Posts() {
  const { currentUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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
    axios
      .get('http://localhost:4000/api/comments')
      .then((res) => {
        setComments(
          res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const addComment = () => {
    const requestData = {
      text: newComment,
    };

    axios
      .post('http://localhost:4000/api/comments', requestData, {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log('Comment added');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

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
                      <h5>{post.title}</h5>
                    </>
                  )}
                  <p className="card-text">{post.desc}</p>
                </div>
                <div>
                  <div className="addComments">
                    <input
                      type="text"
                      placeholder="write a comment"
                      onChange={(event) => {
                        setNewComment(event.target.value);
                      }}
                    />
                    <button onClick={addComment}>Add</button>
                  </div>
                  <div className="commentsList">
                    {comments.map((comment, key) => {
                      return (
                        <div key={key} className="comment">
                          {comment.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No posts available.</div>
        )}
      </div>
    </div>
  );
}

export default Posts;
