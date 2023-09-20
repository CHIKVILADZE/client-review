import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { currentUserId } = useParams();
  const [users, setUsers] = useState([]);
  const [makeAdmin, setMakeAdmin] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error', err);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = (userIdToDelete) => {
    axios
      .delete(`http://localhost:4000/api/users/${userIdToDelete}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(`Deleted User ${userIdToDelete}`, res);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userIdToDelete)
        );
      })
      .catch((error) => {
        console.error(`Error deleting user ${userIdToDelete}`, error);
      });
  };

  const updateAdminStatus = (userIdToUpdate, newAdminStatus) => {
    axios
      .put(
        `http://localhost:4000/api/users/${userIdToUpdate}`,
        {
          isAdmin: newAdminStatus,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userIdToUpdate
                ? { ...user, isAdmin: newAdminStatus }
                : user
            )
          );
          console.log(`updated User ${userIdToUpdate}... Admin`, res.data);
        } else {
          console.error(
            `Error updating user ${userIdToUpdate} Admin`,
            res.data
          );
        }
      })
      .catch((error) => {
        console.error(`Error updating user ${userIdToUpdate} Admin`, error);
      });
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admin</th>
            <th>Delete User</th>
            <th>Block User</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>
                {user.isAdmin ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      updateAdminStatus(user.id, false);
                      console.log('YEEEESSSS', user.id);
                    }}
                  >
                    Yes
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      updateAdminStatus(user.id, true);
                      console.log('noooo', user.id);
                    }}
                  >
                    No
                  </button>
                )}
              </td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete User
                </button>
              </td>
              <td>
                <button className="btn btn-warning">Block User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
