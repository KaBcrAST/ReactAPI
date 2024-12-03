import { PublicClientApplication } from '@azure/msal-browser';

const clientId = 'b4a2a829-d4ce-49b9-9341-22995e0476ba';
const tenantId = '3b644da5-0210-4e60-b8dc-0beec1614542';
const redirectUri = 'http://localhost:3000/auth/callback';


export const msalConfig = {
  auth: {
    clientId: clientId, // Ton client ID
    authority: `https://login.microsoftonline.com/${tenantId}`, // Ton tenant ID
    redirectUri: redirectUri, // URL de redirection
  },
  cache: {
    cacheLocation: 'localStorage', // Utiliser localStorage pour stocker l'état d'authentification
    storeAuthStateInCookie: false,
  },
};

// Créer l'instance MSAL
console.log('Creating MSAL instance with config:', msalConfig);
export const msalInstance = new PublicClientApplication(msalConfig);