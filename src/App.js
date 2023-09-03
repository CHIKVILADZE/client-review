import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import UserProfile from './pages/UserProfile';

function App() {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         'http://localhost:4000/auth/login/success',
  //         {
  //           withCredentials: true,
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json',
  //             'Access-Control-Allow-Credentials': true,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         const resObject = response.data.user;
  //         setUser(resObject);
  //         console.log('User data:', resObject);
  //       } else {
  //         throw new Error('Authentication failed');
  //       }
  //     } catch (err) {
  //       console.log('Error:', err);
  //     }
  //   };

  //   getUser();
  // }, []);

  // console.log('userrrrr1111', user);

  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
