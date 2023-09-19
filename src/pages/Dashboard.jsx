import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      axios.get('http://localhost:4000/api/users').then((response) => {
        console.log('usersREsponse', response);
      });
    };
  });

  return (
    <div>
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
}

export default Dashboard;
