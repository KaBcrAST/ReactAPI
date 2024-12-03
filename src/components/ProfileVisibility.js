import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileVisibility = ({ accessToken }) => {
  const [visibility, setVisibility] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  // Fonction pour récupérer les informations de l'utilisateur
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profiles/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserInfo(response.data);
        setVisibility(response.data.visibility);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  // Fonction pour changer la visibilité
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
      setVisibility(newVisibility);  // Mise à jour de la visibilité localement
    } catch (error) {
      console.error('Error updating visibility', error);
    }
  };

  if (!userInfo) {
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

export default ProfileVisibility;
