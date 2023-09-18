import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  // JSON.parse(localStorage.getItem('user')) || null

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/auth/login',
        inputs,
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = () => {
      axios
        .get('http://localhost:4000/auth/login/success', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (response.status === 200) return response.data;
          throw new Error('Authentication has failed!');
        })
        .then((resObject) => {
          setCurrentUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  console.log('currentUser12344123', currentUser);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);
  console.log('CUREENT User', currentUser);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
