import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type HeaderProps = {
  onSearch: (query: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the user email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    // Clear the user email from localStorage
    localStorage.removeItem('userEmail');
    setUserEmail(null);

    // Optionally refresh the homepage to reflect the logged-out state
    if (router.pathname !== '/') {
      router.push('/');
    } else {
      router.reload();
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => onSearch(e.target.value)}
          className="p-2 rounded text-black"
        />
      </div>
      <h1 className="text-2xl font-bold">Theater System</h1>
      <div className="flex items-center space-x-4">
        {userEmail ? (
          <>
            <span>Welcome, {userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
