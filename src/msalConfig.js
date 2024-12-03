// src/msalConfig.js
export const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID,  // Client ID de ton application Azure AD
      authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,  // Tenant ID
      redirectUri: process.env.REACT_APP_REDIRECT_URI,  // URI de redirection après l'authentification
    },
    cache: {
      cacheLocation: 'sessionStorage',  // Où stocker les tokens
      storeAuthStateInCookie: false,  // Pour une meilleure compatibilité avec certains navigateurs
    },
  };
  
  export const loginRequest = {
    scopes: ['User.Read', 'openid', 'profile', 'email'],  // Scopes nécessaires pour l'authentification
  };
  