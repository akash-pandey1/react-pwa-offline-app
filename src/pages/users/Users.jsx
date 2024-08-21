import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../store/usersSlice';

const Users = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <button><Link to="/add-user">Add User</Link></button>
<ul>
      {users.map((user) => (
        <li key={user.id}><span>{user.id}: </span> {user.name}</li>
      ))}
    </ul>
    </div>
    
  );
}

export default Users;
