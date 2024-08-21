import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../../store/addUserSlice';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newUser = { name, email };
    
    // Dispatch the createPost thunk to handle both online and offline post creation
    dispatch(createUser(newUser));

    // Reset form
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Email:</label>
        <input
        type='email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Create User</button>
    </form>
  );
};

export default AddUser;
