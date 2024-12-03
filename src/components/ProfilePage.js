// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authProvider';

const ProfilePage = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [visibility, setVisibility] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (accessToken) {
        try {
          const response = await axios.get('http://localhost:5000/api/profiles/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setProfile(response.data);
          setVisibility(response.data.visibility);  // Assure-toi que "visibility" est bien dans la réponse
        } catch (error) {
          console.error('Error fetching profile', error);
        }
      }
    };

    fetchProfile();
  }, [accessToken]);

  const handleVisibilityChange = async (newVisibility) => {
    try {
      await axios.put(
        'http://localhost:5000/api/profiles/visibility',
        { visibility: newVisibility },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setVisibility(newVisibility);  // Met à jour la visibilité localement
    } catch (error) {
      console.error('Error updating visibility', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Profile Visibility</h3>
      <p>Current visibility: {visibility}</p>
      <button onClick={() => handleVisibilityChange('public')}>Make Profile Public</button>
      <button onClick={() => handleVisibilityChange('private')}>Make Profile Private</button>
    </div>
  );
};

export default ProfilePage;
