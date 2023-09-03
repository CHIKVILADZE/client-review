// AuthContextProvider.js
import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null); // New state for user data

  const login = async (inputs) => {
    const res = await axios.post(
      'http://localhost:4000/api/auth/login',
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/auth/login/success',
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        if (response.data.user) {
          setCurrentUser(response.data.user);
          setUser(response.data.user);
        } else {
          setCurrentUser(response.data);
          setUser(response.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, user }}>
      {children}
    </AuthContext.Provider>
  );
};
