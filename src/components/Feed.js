import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { msalConfig } from '../context/authConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Feed.css';

// Définir la base URL d'Axios
axios.defaults.baseURL = 'http://localhost:5000';

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      fetchAuthors(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts', error);
    }
  };

  const fetchAuthors = async (posts) => {
    const authorIds = [...new Set(posts.map(post => post.author_id))];
    const authorNames = {};

    for (const authorId of authorIds) {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          ...msalConfig,
          account: accounts[0]
        });
        const graphResponse = await axios.get(`https://graph.microsoft.com/v1.0/users/${authorId}`, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`
          }
        });
        authorNames[authorId] = graphResponse.data.displayName;
      } catch (error) {
        console.error('Erreur lors de la récupération des noms des auteurs', error);
      }
    }

    setAuthors(authorNames);
  };

  const createPost = async () => {
    if (!file) {
      alert('Un post doit contenir soit une image soit une vidéo.');
      return;
    }

    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      const authorId = graphResponse.data.id;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('authorId', authorId);
      formData.append('file', file);

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPosts([response.data, ...posts]);
      setTitle('');
      setBody('');
      setFile(null);
      fetchAuthors([response.data, ...posts]); // Fetch authors again after creating a new post
    } catch (error) {
      console.error('Erreur lors de la création du post', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>LinkedIn Feed</h1>
        <button onClick={goToProfile}>Go to Profile</button>
      </div>
      <div className="feed-post-form">
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
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post._id} className="feed-post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>
              Author: <Link to={`/author/${post.author_id}`}>{authors[post.author_id] || 'Unknown'}</Link>
            </p>
            {post.image && <img src={post.image} alt="Post" />}
            {post.video && <video src={post.video} controls />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;