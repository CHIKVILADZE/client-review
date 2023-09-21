import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function UserPage() {
  const [posts, setPosts] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          'https://client-review-seven.vercel.app/api/posts/'
        );
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const currentPost = posts.find((post) => post.id === postId);

  if (!currentPost) {
    return (
      <div>
        <h4>
          <small className="text-muted">Post not found</small>
        </h4>
      </div>
    );
  }

  const filteredPosts = posts.filter((post) => {
    return post.author.id === currentPost.author.id;
  });

  return (
    <div>
      <h4 className="mt-4">
        <small className="text-muted">Posts by:</small>{' '}
        {currentPost.author.firstName} {currentPost.author.lastName}
      </h4>
      <div className="table-responsive mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Group</th>
              <th>Review Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.group}</td>
                <td>{post.reviewName}</td>
                <td>{post.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserPage;
