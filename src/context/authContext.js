import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [err, setErr] = useState('');

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       setCurrentUser(parsedUser);
  //     } catch (error) {
  //       console.error('Error parsing user from localStorage:', error);
  //     }
  //   }
  // }, []);

  // const login = async (e, inputs) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       'http://localhost:4000/api/auth/login',
  //       inputs,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     if (res.data.Login) {
  //       localStorage.setItem('accessToken', res.data.token);
  //       setCurrentUser(res.data);
  //     } else {
  //       setErr('Login failed. Please check your credentials.');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setErr('An error occurred during login.');
  //   }
  // };

  useEffect(() => {
    const getUser = () => {
      axios
        .get('http://localhost:4000/api/auth/checkauth', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'access-token': localStorage.getItem('accessToken'),
          },
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
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
