import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PopularTags({ t }) {
  const [popularReviews, setPopularReviews] = useState([]);

  useEffect(() => {
    const fetchTopReviews = async () => {
      axios
        .get('https://review-platform-ql9e.onrender.com/api/top-posts')
        .then((response) => {
          setPopularReviews(response.data);
        });
    };

    fetchTopReviews();
  }, []);

  return (
    <div className=" popular-tags">
      <h5 className="mb-3">{t('home.popularPosts')} </h5>
      <ul className="list-group">
        {Array.isArray(popularReviews) &&
          popularReviews.map((post) => (
            <Link
              to={`post/${post.id}`}
              key={post.id}
              className="main list-group-item"
            >
              {post.reviewName}
            </Link>
          ))}
      </ul>
    </div>
  );
}

export default PopularTags;
