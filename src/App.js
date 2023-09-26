import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Reviews from './pages/Reviews';
import { useTranslation } from 'react-i18next';
import UserPage from './pages/UserPage';
import Dashboard from './pages/Dashboard';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import MyProfile from './components/MyProfile';

function App() {
  const [t, i18next] = useTranslation('global');
  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser ? currentUser.id : null;
  const handleChangeLanguage = (lang) => {
    i18next.changeLanguage(lang);
  };

  return (
    <>
      <BrowserRouter>
        <Navbar
          t={t}
          handleChangeLanguage={handleChangeLanguage}
          currentUserId={currentUserId}
        />

        <Routes>
          <Route path="/" element={<Home t={t} />} />
          <Route path="/register" element={<Register t={t} />} />
          <Route path="/login" element={<Login t={t} />} />
          <Route path="/profile" element={<Profile t={t} />} />
          <Route path="/post/:postId" element={<Post t={t} />} />
          <Route path="/reviews/:postId" element={<Reviews t={t} />} />
          <Route path="/userpage/:postId" element={<UserPage t={t} />} />
          <Route path="/myprofile/:postId" component={MyProfile} />

          <Route
            path="/dashboard/:currentUserId"
            element={<Dashboard t={t} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
