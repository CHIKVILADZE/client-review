import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import axios from 'axios';
import MyProfile from '../components/MyProfile';

function Profile() {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [reviewGroup, setReviewGroup] = useState();
  const [reviewName, setReviewName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append('title', formData.title);
      form.append('desc', formData.desc);
      form.append('group', reviewGroup);
      form.append('reviewName', reviewName);
      form.append('image', file);
      form.append('userId', currentUser.id);
      form.append(
        'author',
        JSON.stringify({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        })
      );

      const response = await axios.post(
        'http://localhost:4000/api/posts',
        form,
        {
          withCredentials: true,
        }
      );

      console.log('Post submission successful:', response.data);

      setFile(null);
      setFormData({
        title: '',
        desc: '',
      });
      setReviewGroup('');
      setReviewName('');
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };
  console.log('currentUser', currentUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  console.log('filee', file);

  const handleSelectChange = (event) => {
    setReviewGroup(event.target.value);
  };
  console.log('reviewGroup', reviewGroup);

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
                <div className="form-group">
                  <label htmlFor="group">Group</label>
                  <select
                    name="group"
                    id="group"
                    className="form-control"
                    value={formData.group}
                    onChange={handleSelectChange}
                  >
                    <option value="">Select group</option>
                    <option value="Movies">Movie</option>
                    <option value="Books">Book</option>
                    <option value="Games">Game</option>
                  </select>
                </div>
                <div className="d-flex flex-column mt-4">
                  <input
                    type="text"
                    placeholder="Enter Review Name"
                    required
                    className="form-control rounded-lg"
                    name="reviewName"
                    onChange={(e) => setReviewName(e.target.value)}
                    value={formData.reviewName}
                  />
                </div>

                <div className="mb-3 mt-2">
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
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFile}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <MyProfile />
    </div>
  );
}

export default Profile;
