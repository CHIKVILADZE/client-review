import axios from 'axios';
import React, { useEffect } from 'react';

function Review() {
  useEffect(() => {
    const fetchReviews = async () => {
      axios.get('http://localhost:4000/api/reviews').then((response) => {
        console.log('reviews', response);
      });
    };
  });

  return <div></div>;
}

export default Review;
