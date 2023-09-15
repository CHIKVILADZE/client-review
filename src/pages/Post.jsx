import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { AuthContext } from '../context/authContext';
import { AiFillStar } from 'react-icons/ai';

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
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [rating, setRating] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewGroup, setReviewGroup] = useState('');
  const [sumRating, setSumRating] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [avarageRating, setAvarageRating] = useState(0);

  // const updateLikeIcon = (value) => {
  //   setLikeIcon(value);
  //   localStorage.setItem(`likeIcon_${postId}`, JSON.stringify(value));
  // };

  useEffect(() => {
    const fetchPostAndLikes = async () => {
      try {
        const [
          postResponse,
          commentsResponse,
          likesResponse,
          reviewsResponse,
          moviesResponse,
          booksResponse,
          gamesResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:4000/api/posts/${postId}`),
          axios.get(`http://localhost:4000/api/comments?postId=${postId}`),
          axios.get(`http://localhost:4000/api/likes?postId=${postId}`),
          axios.get(`http://localhost:4000/api/reviews?postId=${postId}`),
          axios.get(`http://localhost:4000/api/movies?postId=${postId}`),
          axios.get(`http://localhost:4000/api/books?postId=${postId}`),
          axios.get(`http://localhost:4000/api/games?postId=${postId}`),
        ]);

        setPost(postResponse.data);
        setComments({
          ...comments,
          [postId]: commentsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        });

        const { likeIds, userIds } = likesResponse.data;

        // Define matchingPosts outside of the conditionals
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

        // calculate avarage ratings for start
        const avarageRatings = sumOfRatings / matchingPosts.length / 2;
        const roundedAverageRating = Math.round(avarageRatings);
        setAvarageRating(roundedAverageRating);

        console.log('SUMmm', sumOfRatings);
        console.log('MATChingpooost', matchingPosts);
        console.log('avarageeee', roundedAverageRating);

        setLike(userIds);

        setReviewGroup(postResponse.data.group);

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    let review = {
      postId: postId,
      name: post.reviewName,
      text: reviewText,
      rating: rating,
      group: reviewGroup,
    };

    try {
      // Send the review data to your API
      const response = await axios.post(
        `http://localhost:4000/api/${reviewGroup}`,
        review,
        {
          withCredentials: true,
        }
      );

      // Assuming your API returns the updated post with the new review
      const updatedPost = response.data;

      // Calculate the updated average rating

      // Now, send a POST request to update the 'sumRating' field of the post
      // Update the post data with the new 'sumRating'
      const updatedPostData = {
        ...post,
        sumRating: avarageRating.toString(),
      };

      // Send the updated post data to the '/api/posts' endpoint
      await axios.put(
        `http://localhost:4000/api/posts/${postId}`,
        updatedPostData,
        {
          withCredentials: true,
        }
      );

      // Clear the form fields
      setReviewText('');
      setRating('');

      console.log('Review added successfully:', response);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
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
                      Post by:{' '}
                      <span className="font-weight-bold">
                        {post.author.firstName}&nbsp;{post.author.lastName}
                      </span>
                    </p>

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
                      <button
                        className="btn btn-primary mt-2"
                        onClick={addComment}
                      >
                        Add
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
                              {post.author.firstName}&nbsp;
                              {post.author.lastName}
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
          <div className="card">
            <div className="card-body">
              <h4>Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                  <div className="d-flex flex-column">
                    {' '}
                    {post && (
                      <>
                        <label htmlFor="reviewName">Review Name</label>
                        <input type="text" value={post.reviewName} readOnly />
                        <label htmlFor="reviewGroup" className="mt-2">
                          Review Group
                        </label>
                        <input type="text" value={post.group} readOnly />
                      </>
                    )}
                  </div>

                  <div className="form-group mt-4">
                    <label htmlFor="reviewText">Review Text</label>
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
                      Rating
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
                  Add Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
