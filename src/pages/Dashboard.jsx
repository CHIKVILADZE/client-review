import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { currentUserId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'https://server-review.onrender.com/api/users'
        );
        console.log('Users Data:', response.data);

        const savedIsBlockedValues =
          JSON.parse(localStorage.getItem('isBlockedValues')) || {};

        const updatedUsers = response.data.map((user) => ({
          ...user,
          isBlocked: savedIsBlockedValues[user.id] || false,
        }));

        setUsers(updatedUsers);
      } catch (err) {
        console.error('Error', err);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = (userIdToDelete) => {
    axios
      .delete(
        `https://server-review.onrender.com/api/users/${userIdToDelete}`,
        {
          withCredentials: true,
        }
      )
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
        `https://server-review.onrender.com/api/users/${userIdToUpdate}`,
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

  const handleBlockUser = (userIdToBlock) => {
    axios
      .put(
        `https://server-review.onrender.com/api/users/${userIdToBlock}/block`,
        {
          isBlocked: true,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.id === userIdToBlock) {
                const updatedUser = { ...user, isBlocked: true };
                const savedIsBlockedValues =
                  JSON.parse(localStorage.getItem('isBlockedValues')) || {};
                savedIsBlockedValues[userIdToBlock] = true;
                localStorage.setItem(
                  'isBlockedValues',
                  JSON.stringify(savedIsBlockedValues)
                );
                return updatedUser;
              } else {
                return user;
              }
            })
          );
          console.log(`Blocked User ${userIdToBlock}`, res.data);
        } else {
          console.error(`Error blocking user ${userIdToBlock}`, res.data);
        }
      })
      .catch((error) => {
        console.error(`Error blocking user ${userIdToBlock}`, error);
      });
  };

  const handleUnblockUser = (userIdToUnblock) => {
    axios
      .put(
        `https://server-review.onrender.com/api/users/${userIdToUnblock}/block`,
        {
          isBlocked: false,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => {
              if (user.id === userIdToUnblock) {
                const updatedUser = { ...user, isBlocked: false };
                const savedIsBlockedValues =
                  JSON.parse(localStorage.getItem('isBlockedValues')) || {};
                delete savedIsBlockedValues[userIdToUnblock];
                localStorage.setItem(
                  'isBlockedValues',
                  JSON.stringify(savedIsBlockedValues)
                );
                return updatedUser;
              } else {
                return user;
              }
            })
          );
          console.log(`Unblocked User ${userIdToUnblock}`, res.data);
        } else {
          console.error(`Error unblocking user ${userIdToUnblock}`, res.data);
        }
      })
      .catch((error) => {
        console.error(`Error unblocking user ${userIdToUnblock}`, error);
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
                {user.isBlocked ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleUnblockUser(user.id)}
                  >
                    UnBlock User
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleBlockUser(user.id)}
                  >
                    Block User
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
