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
        'https://server-review.onrender.com/api/auth/login',
        inputs,
        {
          withCredentials: true,
        }
      );

      // Assuming your server responds with an 'accessToken' property in the response data
      const accessToken = res.data.accessToken;

      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken);

        setCurrentUser(res.data);

        localStorage.setItem('user', JSON.stringify(res.data));
      } else {
        console.error('accessToken is undefined in the response.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = () => {
      axios
        .get('https://server-review.onrender.com/auth/login/success', {
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
