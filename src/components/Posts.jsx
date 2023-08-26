import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { makeRequest } from '../axios';

function Posts() {
  const { isLoading, error, data } = useQuery('posts', () =>
    makeRequest.get('/posts').then((res) => {
      return res.data;
    })
  );

  return (
    <div>
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
}

export default Posts;
