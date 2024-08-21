import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../store/blogSlice';

const Blogs = () => {
    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => state.blogs);
  
    useEffect(() => {
      if (navigator.onLine) {
        dispatch(fetchPosts());
      } else {
        // Offline, display cached data
      }
    }, [dispatch]);
  
    return (
      <div>
        <h1>Blogs</h1>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

export default Blogs;
