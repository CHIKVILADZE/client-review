import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [err, setErr] = useState('');

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const getUser = () => {
      axios
        .get('https://server-review.onrender.com/api/users/checkauth', {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resObject) => {
          setCurrentUser(resObject.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
