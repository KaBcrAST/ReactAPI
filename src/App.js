import React, { useState } from 'react';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (user, token) => {
    console.log('User logged in:', user);
    setUser(user);
    setToken(token);
  };

  return (
    <div className="App">
      <h1>My App</h1>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Access Token: {token}</p>
        </div>
      )}
    </div>
  );
}

export default App;
