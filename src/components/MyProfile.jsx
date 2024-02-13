import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

function MyProfile({ t }) {
  const [posts, setPosts] = useState([]);
  const { postId } = useParams();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          'https://review-platform-ql9e.onrender.com/api/posts'
        );
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const currentUserId = currentUser ? currentUser.id : null;

  const userPosts = posts.filter((post) => post.authorId === currentUserId);

  const handleDeletePost = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.delete(
        `https://review-platform-ql9e.onrender.com/api/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        console.log('Post deleted successfully');
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border-bottom">
      <h1>My Posts</h1>
      <table className="table">
        <thead>
          <tr>
            <th>{t('profile.title')}</th>
            <th>{t('profile.group')}</th>
            <th>{t('profile.reviewName')}</th>
            <th> {t('profile.createdAt')}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post, index) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.group}</td>
              <td>{post.reviewName}</td>
              <td>{post.createdAt}</td>
              <td>
                <div className="button-group d-flex gap-1">
                  <Link to={`/post/${post.id}`}>
                    <button className="btn btn-info mr-2">Read</button>
                  </Link>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleDeletePost(postId)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyProfile;
