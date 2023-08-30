import React from 'react';
import Posts from '../components/Posts';

function Home({ user }) {
  return (
    <div>
      <Posts user={user} />
    </div>
  );
}

export default Home;
