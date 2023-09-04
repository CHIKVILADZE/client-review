import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios'; // Import Axios

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:4000/api/posts',
        {
          title: formData.title,
          desc: formData.desc,
          userId: currentUser.id,
        },
        {
          withCredentials: true,
        }
      );

      console.log('Post submission successful:', response.data);

      setFormData({
        title: '',
        desc: '',
      });
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card bg-info">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    required
                    placeholder="Enter your title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="desc" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="desc"
                    required
                    name="desc"
                    rows="5"
                    placeholder="Enter your description"
                    value={formData.desc}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
