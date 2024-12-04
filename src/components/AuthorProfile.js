import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { msalConfig } from '../context/authConfig';
import { useParams } from 'react-router-dom';

const AuthorProfile = () => {
  const [profile, setProfile] = useState(null);
  const { instance, accounts } = useMsal();
  const { authorId } = useParams();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const tokenResponse = await instance.acquireTokenSilent({
        ...msalConfig,
        account: accounts[0]
      });
      const response = await axios.get(`https://graph.microsoft.com/v1.0/users/${authorId}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        }
      });
      const userProfile = await axios.get(`/api/profiles/${response.data.mail}`);
      setProfile(userProfile.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  if (!profile.isPublic) {
    return <div>Profil masqué</div>;
  }

  return (
    <div>
      <h1>Author Profile</h1>
      <p>Name: {profile.displayName}</p>
      <p>Email: {profile.email}</p>
      <p>Job Title: {profile.bio}</p>
      {/* Ajoutez d'autres informations de profil si nécessaire */}
    </div>
  );
};

export default AuthorProfile;