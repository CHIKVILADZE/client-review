import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { AuthContext } from '../context/authContext';
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

function Post({ t }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState([]);
  const [likeIcon, setLikeIcon] = useState(false);
  const [likeLength, setLikeLength] = useState(0);
  const [currentUserLikeId, setCurrentUserLikeId] = useState([]);
  const [rating, setRating] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewGroup, setReviewGroup] = useState('');
  const [sumRating, setSumRating] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [avarageRating, setAvarageRating] = useState(0);

  useEffect(() => {
    const fetchPostAndLikes = async () => {
      try {
        const [
          postResponse,
          commentsResponse,
          likesResponse,

          moviesResponse,
          booksResponse,
          gamesResponse,
        ] = await Promise.all([
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/posts/${postId}`
          ),
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/comments?postId=${postId}`
          ),
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/likes?postId=${postId}`
          ),
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/movies?postId=${postId}`
          ),
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/books?postId=${postId}`
          ),
          axios.get(
            `https://review-platform-ql9e.onrender.com/api/games?postId=${postId}`
          ),
        ]);

        setPost(postResponse.data);
        setComments({
          ...comments,
          [postId]: commentsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        });

        setLikes(likesResponse.data);
        setLikeLength(likesResponse.data.length);

        let matchingPosts = [];

        if (postResponse.data.group === 'Movies') {
          matchingPosts = moviesResponse.data.filter(
            (movie) => movie.postId === postId
          );
        } else if (postResponse.data.group === 'Books') {
          matchingPosts = booksResponse.data.filter(
            (book) => book.postId === postId
          );
        } else if (postResponse.data.group === 'games') {
          matchingPosts = gamesResponse.data.filter(
            (game) => game.postId === postId
          );
        }

        const sumOfRatings = matchingPosts.reduce((acc, post) => {
          return acc + (parseFloat(post.rating) || 0);
        }, 0);

        setSumRating(sumOfRatings);

        const avarageRatings = sumOfRatings / matchingPosts.length / 2;

        const roundedAverageRating = Math.round(avarageRatings);
        setAvarageRating(roundedAverageRating);

        const currentUserLike = likesResponse.data.find(
          (like) => like.userId === (currentUser ? currentUser.id : null)
        );

        if (currentUserLike) {
          setLikeIcon(true);
        } else {
          setLikeIcon(false);
        }

        setReviewGroup(postResponse.data.group);
        setCurrentUserLikeId(currentUserLike);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post and likes:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchPostAndLikes();
  }, [postId, currentUser]);

  const addComment = () => {
    const { id, firstName, lastName } = currentUser;

    const requestData = {
      text: newComment,
      postId: postId,
      userId: id,
      author: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      },
    };
    const accessToken = localStorage.getItem('accessToken');

    axios
      .post(
        'https://review-platform-ql9e.onrender.com/api/comments',
        requestData,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setComments({
          ...comments,
          [postId]: [
            ...comments[postId],
            { text: newComment, author: { firstName, lastName } },
          ],
        });
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const handleLike = () => {
    const { id } = currentUser;
    const accessToken = localStorage.getItem('accessToken');

    axios
      .post(
        'https://review-platform-ql9e.onrender.com/api/likes',
        { postId: postId, userId: id },
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        const updatedLikeInfo = response.data;

        setLikeIcon(true);

        setLikeLength((prevLikeLength) => prevLikeLength + 1);
      })
      .catch((error) => {
        console.error('Error liking post:', error);
      });
  };

  const handleDislike = () => {
    axios
      .delete(
        `https://review-platform-ql9e.onrender.com/api/likes/${currentUserLikeId}`,
        {
          data: {
            postId: postId,
            userId: currentUser.id,
          },
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        setLikeIcon(false);
        setLikeLength((prevLikeLength) => prevLikeLength - 1);

        console.log('Like removed successfully');
      })
      .catch((error) => {
        console.error('Error disliking post:', error);
      });
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    let review = {
      userId: currentUser.id,
      postId: postId,
      name: post.reviewName,
      text: reviewText,
      rating: rating,
      group: reviewGroup,
      author: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      },
    };
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(
        `https://review-platform-ql9e.onrender.com/api/${reviewGroup}`,
        review,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedPostData = {
        ...post,
        sumRating: avarageRating.toString(),
      };

      await axios.put(
        `https://review-platform-ql9e.onrender.com/api/posts/${postId}`,
        updatedPostData,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setReviewText('');
      setRating('');

      console.log('Review added :', response);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };
  return (
    <div className="container mt-4 ">
      <div className="row ">
        <div className="col-md-8 ">
          <div className="card">
            <div className="card-body main">
              {post ? (
                <>
                  <div>
                    <h2 className="card-title">{post.title} </h2>
                    <div>
                      {[...Array(5)].map((_, index) => (
                        <AiFillStar
                          key={index}
                          size={25}
                          className={
                            index < avarageRating
                              ? 'text-warning'
                              : 'text-secondary'
                          }
                        />
                      ))}
                    </div>
                    <p className="card-text">
                      {t('post.postBy')}:&nbsp;
                      <span className="font-weight-bold">
                        {post.author.firstName}&nbsp;{post.author.lastName}
                      </span>
                    </p>

                    <div className="container text-center">
                      <img
                        src={`https://review-platform-ql9e.onrender.com/images/${post.image}`}
                        alt=""
                        className="img-fluid "
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="container mt-2">
                      {' '}
                      <p className="card-text">{post.desc}</p>
                    </div>
                  </div>
                  <div className="d-flex p-3 justify-content-between ">
                    {likeIcon === true ? (
                      <FcLike onClick={handleDislike} />
                    ) : (
                      <FcLikePlaceholder onClick={handleLike} />
                    )}
                    <span>{likeLength} Likes</span>
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
                      <button
                        className="btn btn-primary mt-2"
                        onClick={addComment}
                      >
                        {t('post.addComment')}
                      </button>
                    </div>
                  </div>
                  <div className="commentsList">
                    {comments[postId].map((comment, key) => {
                      return (
                        <div key={key} className="card mt-2">
                          <div className="card-body">
                            <span className="text-info">
                              {' '}
                              {comment.author.firstName}&nbsp;
                              {comment.author.lastName}
                            </span>
                            <p className="card-text text-dark">
                              {comment.text}
                            </p>
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
        <div className="col-md-4">
          <div className=" main card">
            <div className="card-body">
              <h4> {t('post.review')}</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <div className="d-flex flex-column">
                    {' '}
                    {post && (
                      <>
                        <label htmlFor="reviewName">
                          {' '}
                          {t('post.reviewName')}
                        </label>
                        <input
                          type="text"
                          value={post.reviewName}
                          readOnly
                          id="reviewName"
                          name="reviewName"
                        />
                        <label htmlFor="reviewGroup" className="mt-2">
                          {t('post.reviewGroup')}
                        </label>
                        <input
                          type="text"
                          value={post.group}
                          readOnly
                          id="reviewGroup"
                          name="reviewGroup"
                        />
                      </>
                    )}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="reviewText"> {t('post.reviewText')}</label>
                    <textarea
                      className="form-control mt-2"
                      id="reviewText"
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="d-flex flex-column mt-4">
                    {' '}
                    <label htmlFor="rating" className="form-label">
                      {t('post.rating')}
                    </label>
                    <input
                      type="number"
                      className="form-control w-100 custom-input"
                      name="rating"
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      min="0"
                      max="10"
                      placeholder="0-10"
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">
                  {t('post.addReview')}{' '}
                </button>
              </form>
            </div>
          </div>
          <Link
            className="text-decoration-none fs-5 text-info"
            to={`/reviews/${postId}`}
          >
            {' '}
            {t('post.allReview')}{' '}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Post;
