import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { msalConfig } from '../context/authConfig';
import './Profile.css';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    fetchProfile();
  }, []);

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
      console.log('Graph response:', response.data); // Ajoutez ce log pour vérifier la réponse
      const email = response.data.mail || response.data.userPrincipalName; // Utilisez userPrincipalName si mail est manquant
      const userProfile = await axios.get(`/api/profiles/${email}`);
      setProfile(userProfile.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil', error);
    }
  };

  const togglePrivacy = async () => {
    try {
      const updatedProfile = { ...profile, isPublic: !profile.isPublic };
      await axios.put(`/api/profiles/${profile.email}`, updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
    }
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
    </div>
  );
};

export default Profile;