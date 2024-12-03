import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react'; // Utilisation du hook de MSAL React
import { msalConfig } from '../context/authConfig';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const { instance } = useMsal(); // Instance MSAL

  const login = async () => {
    setLoading(true);
    try {
      console.log('Attempting login...');
      const loginResponse = await instance.loginPopup(msalConfig); // Utilisation du loginPopup
      const user = loginResponse.account;  // Informations sur l'utilisateur
      const token = loginResponse.accessToken;  // Token d'accès

      console.log('Login successful:', user, token);
      // Transmettre les données à App.js
      onLogin(user, token);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default Login;
