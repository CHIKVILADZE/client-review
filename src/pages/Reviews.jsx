import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PDFFile from '../components/PDFFile';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AuthContext } from '../context/authContext';

function Reviews({ t }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [postData, setPostData] = useState([]);
  const [starsRating, setStarsRating] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPostAndData = async () => {
      try {
        const [postResponse, moviesResponse, booksResponse, gamesResponse] =
          await Promise.all([
            axios.get(`https://server-review.onrender.com/api/posts/${postId}`),
            axios.get(
              `https://server-review.onrender.com/api/movies?postId=${postId}`
            ),
            axios.get(
              `https://server-review.onrender.com/api/books?postId=${postId}`
            ),
            axios.get(
              `https://server-review.onrender.com/api/games?postId=${postId}`
            ),
          ]);

        if (!postResponse || !postResponse.data) {
          console.error('Post data not found');
          return;
        }

        const post = postResponse.data;

        if (post.group === 'Movies' && moviesResponse && moviesResponse.data) {
          const matchingData = moviesResponse.data.filter(
            (item) => item.postId === postId
          );
          setPostData(matchingData);
        } else if (
          post.group === 'Books' &&
          booksResponse &&
          booksResponse.data
        ) {
          const matchingData = booksResponse.data.filter(
            (item) => item.postId === postId
          );
          setPostData(matchingData);
        } else if (
          post.group === 'games' &&
          gamesResponse &&
          gamesResponse.data
        ) {
          const matchingData = gamesResponse.data.filter(
            (item) => item.postId === postId
          );

          setPostData((prevData) => [...matchingData, ...prevData]);
        } else {
          console.error('Data not found for the specified group');
        }

        setPost(post);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostAndData();
  }, []);
  console.log('rating', starsRating);
  console.log('postDAtaa', postData);
  console.log('current usssssss', currentUser);

  return (
    <div className="container mt-4">
      {post && (
        <div key={post.id}>
          <h2>{post.reviewName}</h2>
          <div>
            <img
              src={`https://server-review.onrender.com/images/${post.image}`}
              alt=""
              className="img-fluid"
              style={{ width: '50%' }}
            />
          </div>

          <p>
            <span className="text-muted">
              {t('reviews.postBy')}: {post.author.firstName}{' '}
              {post.author.lastName} <br />
            </span>
          </p>
        </div>
      )}
      {postData.length > 0 && (
        <div>
          <h3 className="mt-4">{t('reviews.reviewData')}</h3>
          <ul className="list-group">
            {postData.map((data, index) => (
              <li key={index} className="list-group-item">
                <h6>
                  {data.author.firstName} {data.author.lastName}{' '}
                  <span className="text-secondary">
                    - Rating: {data.rating}
                  </span>
                </h6>{' '}
                {data.text}
              </li>
            ))}
          </ul>
          <PDFDownloadLink
            document={<PDFFile post={post} t={t} postData={postData} />}
            fileName="Form"
          >
            {({ loading }) =>
              loading ? (
                <button>Loading Document...</button>
              ) : (
                <button>Download PDF</button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}

export default Reviews;
