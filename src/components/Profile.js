import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { msalConfig } from '../context/authConfig';
import './Profile.css';

// Définir la base URL d'Axios
axios.defaults.baseURL = 'http://localhost:5000';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userIdFromGraph, setUserIdFromGraph] = useState(null);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchUserIdFromGraph();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const response = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      const email = response.data.mail || response.data.userPrincipalName;
      const userProfile = await axios.get(`/api/profiles/${email}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      setProfile(userProfile.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const graphResponse = await axios.get(`https://graph.microsoft.com/v1.0/me`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      const userId = graphResponse.data.id;
      const response = await axios.get(`/api/profile/${userId}/posts`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts de l\'utilisateur', error);
    }
  };

  const fetchUserIdFromGraph = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      setUserIdFromGraph(response.data.id);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur', error);
    }
  };

  const togglePrivacy = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const updatedProfile = { ...profile, isPublic: !profile.isPublic };
      await axios.put(`/api/profiles/${profile.email}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      await axios.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        },
        data: { userId: userIdFromGraph }
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Erreur lors de la suppression du post', error);
    }
  };

  const handleUpdatePost = async (postId, updatedPost) => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const response = await axios.put(`/api/posts/${postId}`, {
        ...updatedPost,
        userId: userIdFromGraph
      }, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      setPosts(posts.map(post => (post._id === postId ? response.data : post)));
    } catch (error) {
      console.error('Erreur lors de la modification du post', error);
    }
  };

  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const startEditing = (post) => {
    setEditPostId(post._id);
    setEditTitle(post.title);
    setEditBody(post.body);
  };

  const saveEdit = async () => {
    await handleUpdatePost(editPostId, { title: editTitle, body: editBody });
    setEditPostId(null);
    setEditTitle('');
    setEditBody('');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://via.placeholder.com/80" alt="Profile" />
        <h1>{profile.displayName}</h1>
      </div>
      <div className="profile-info">
        <p>Email: {profile.email}</p>
        <p>Job Title: {profile.bio}</p>
        <p>Privacy: {profile.isPublic ? 'Public' : 'Private'}</p>
      </div>
      <div className="profile-actions">
        <button onClick={togglePrivacy}>
          {profile.isPublic ? 'Set to Private' : 'Set to Public'}
        </button>
      </div>
      <div className="profile-posts">
        {posts.map((post) => (
          <div key={post._id} className="profile-post">
            {editPostId === post._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditPostId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                {post.image && <img src={post.image} alt="Post" />}
                {post.video && <video src={post.video} controls />}
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                <button onClick={() => startEditing(post)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;