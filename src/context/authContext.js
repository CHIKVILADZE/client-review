import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();

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

  const login = async (inputs) => {
    try {
      const res = await axios
        .post('http://localhost:4000/api/auth/login', inputs, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.Login) {
            localStorage.setItem('accessToken', res.data.token);

            setCurrentUser(res.data);

            navigate('/');
          }
        });

      // localStorage.setItem('user', JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = () => {
      axios
        .get('http://localhost:4000/auth/checkauth', {
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
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
