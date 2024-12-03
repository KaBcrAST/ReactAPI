import React, { useState } from 'react';
import Login from './components/Login';
import Feed from './components/Feed';

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
        <Feed user={user} />
      )}
    </div>
  );
}

export default App;
