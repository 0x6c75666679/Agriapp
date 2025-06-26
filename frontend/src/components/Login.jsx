import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email === 'user@example.com' && password === 'password123') {
      setLoggedIn(true);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      {loggedIn ? (
        <h2 className="text-2xl font-bold">Welcome, {email}!</h2>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            Login
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default LoginPage;
