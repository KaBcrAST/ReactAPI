import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Feed from './components/Feed';
import Profile from './components/Profile';
import AuthorProfile from './components/AuthorProfile';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (user, token) => {
    console.log('User logged in:', user);
    setUser(user);
    setToken(token);
  };

  return (
    <Router>
      <div className="App">
        <h1>My App</h1>
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/author/:authorId" element={<AuthorProfile />} />
            <Route path="/" element={<Feed user={user} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
