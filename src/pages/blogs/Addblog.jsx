import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../../store/addBlogSlice'; // Import your Redux thunk for creating posts

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newPost = { title, body };
    
    // Dispatch the createPost thunk to handle both online and offline post creation
    dispatch(createPost(newPost));

    // Reset form
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Body:</label>
        <textarea 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
