import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

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

      localStorage.setItem('user', JSON.stringify(res.data));
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

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
