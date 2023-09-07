import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { AuthContext } from '../context/authContext';

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [like, setLike] = useState([]);
  const [likeIds, setLikeIds] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const { currentUser } = useContext(AuthContext);

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
    axios
      .get(`http://localhost:4000/api/likes?postId=${postId}`)
      .then((response) => {
        const { postId, likeIds, userIds } = response.data;
        console.log('Like IDs for the post:', postId, userIds, likeIds);

        setLikeIds(likeIds);

        const currentUserLiked = userIds.includes(currentUser.id);

        setLike(currentUserLiked ? [currentUser.id] : []);

        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });

    fetchPostById();
  }, [postId]);
  console.log('likes', like);

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

  const handleLike = () => {
    axios
      .post(
        'http://localhost:4000/api/likes',
        { postId: postId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        const updatedLikeInfo = response.data;

        setLike([...like, updatedLikeInfo.userId]);
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  console.log('LIKEIIDD', likeIds);
  const handleDislike = () => {
    axios
      .delete('http://localhost:4000/api/likes', {
        data: {
          id: likeIds,
          postId: postId,
          userId: currentUser.id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log('responseeeee', response);

        alert(response.data);
      })
      .catch((error) => {
        console.error('Error disliking post:', error);
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
              <div className="d-flex">
                <div className="d-flex justify-content-between">
                  {like.includes(currentUser.id) ? (
                    <FcLike onClick={handleDislike} />
                  ) : (
                    <FcLikePlaceholder onClick={handleLike} />
                  )}

                  <br />
                  <span>{like.length} Likes</span>
                </div>
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
