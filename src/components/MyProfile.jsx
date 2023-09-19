import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

function MyProfile() {
  const [posts, setPosts] = useState([]);
  const { postId } = useParams();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const currentPost = posts.find((post) => post.id === postId);

  console.log('currentUser10000', currentPost);

  return (
    <div>
      <h1>MyPosts</h1>
    </div>
  );
}

export default MyProfile;
