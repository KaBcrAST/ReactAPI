import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts', error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post('/api/posts', { title, body, authorId: user.id });
      setPosts([response.data, ...posts]);
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Erreur lors de la création du post', error);
    }
  };

  return (
    <div>
      <h1>LinkedIn Feed</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>Author: {post.author.displayName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;