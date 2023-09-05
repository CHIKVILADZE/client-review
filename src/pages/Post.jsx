import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    axios
      .get(`http://localhost:4000/api/comments?postId=${postId}`)
      .then((res) => {
        setComments({
          ...comments,
          [postId]: res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });

    fetchPostById();
  }, [postId]);

  const addComment = () => {
    const requestData = {
      text: newComment,
      postId: postId,
    };

    axios
      .post('http://localhost:4000/api/comments', requestData, {
        withCredentials: true,
      })
      .then((response) => {
        setComments({
          ...comments,
          [postId]: [...comments[postId], { text: newComment }],
        });
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="card w-80 mx-auto">
        <div className="card-body">
          {post ? (
            <>
              <div>
                <h1 className="card-text">Author: {post.author.firstName}</h1>
                <h4 className="card-title">Post - {post.title}</h4>
                <p className="card-text">{post.desc}</p>
              </div>
              <div className="card-footer">
                <div className="addComments">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment"
                    value={newComment}
                    onChange={(event) => {
                      setNewComment(event.target.value);
                    }}
                  />
                  <button className="btn btn-primary mt-2" onClick={addComment}>
                    Add
                  </button>
                </div>
              </div>
              <div className="commentsList">
                {comments[postId].map((comment, key) => {
                  return (
                    <div key={key} className="card mt-2">
                      <div className="card-body">
                        <p className="card-text">{comment.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
