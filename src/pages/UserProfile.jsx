import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

function UserProfile({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // Render a loading state while waiting for currentUser
    return <p>Loading...</p>;
  }

  // Render user data when currentUser is available
  return (
    <div>
      <h1>User Profile</h1>
      <p>
        Name: {currentUser.firstName} {currentUser.lastName}
      </p>
      <p>Email: {currentUser.email}</p>
      {/* Add more user data here */}
    </div>
  );
}

export default UserProfile;
