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
  const [likeIcon, setLikeIcon] = useState(false);
  const [likeCount, setLikeCount] = useState(null);

  const { currentUser } = useContext(AuthContext);

  // const updateLikeIcon = (value) => {
  //   setLikeIcon(value);
  //   localStorage.setItem(`likeIcon_${postId}`, JSON.stringify(value));
  // };

  useEffect(() => {
    const fetchPostAndLikes = async () => {
      try {
        const [postResponse, commentsResponse, likesResponse] =
          await Promise.all([
            axios.get(`http://localhost:4000/api/posts/${postId}`),
            axios.get(`http://localhost:4000/api/comments?postId=${postId}`),
            axios.get(`http://localhost:4000/api/likes?postId=${postId}`),
          ]);

        setPost(postResponse.data);
        setComments({
          ...comments,
          [postId]: commentsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        });

        const { likeIds, userIds } = likesResponse.data;

        setLike(userIds);

        if (userIds.includes(currentUser.id)) {
          setLikeIcon(true);
        } else {
          setLikeIcon(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post and likes:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchPostAndLikes();
  }, [postId, currentUser.id]);

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
        setLikeIcon(true);
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

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
        const updatedLikeInfo = response.data;
        setLike([updatedLikeInfo.userId]);
        setLikeIcon(false);
        console.log('deleteresponsee', response.data);
      })
      .catch((error) => {
        console.error('Error disliking post:', error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="card w-50 mx-auto">
        <div className="card-body">
          {post ? (
            <>
              <div>
                <h1 className="card-text">Author: {post.author.firstName}</h1>
                <h4 className="card-title">Post - {post.title}</h4>
                <div>
                  <img
                    src={`http://localhost:4000/images/${post.image}`}
                    alt=""
                    className="img-fluid"
                    style={{ width: '90%' }}
                  />
                </div>
                <p className="card-text">{post.desc}</p>
              </div>
              <div className="d-flex justify-content-between">
                {likeIcon === true ? (
                  <FcLike onClick={handleDislike} />
                ) : (
                  <FcLikePlaceholder onClick={handleLike} />
                )}
                <span>{like.length} Likes</span>
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
