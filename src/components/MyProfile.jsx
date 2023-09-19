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
        const response = await axios.get('http://localhost:4000/api/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const currentUserId = currentUser ? currentUser.id : null;

  const userPosts = posts.filter((post) => post.authorId === currentUserId);

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
                  <button className="btn btn-warning mr-2">Edit</button>
                  <button className="btn btn-danger">Delete</button>
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
