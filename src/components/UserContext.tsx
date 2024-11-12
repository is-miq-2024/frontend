import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userLogin: string | null;
  setUserLogin: (id: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLogin, setUserLogin] = useState<string | null>(null);

  // load userlogin from localStorage
  useEffect(() => {
    const storedUserLogin = localStorage.getItem('userLogin');
    if (storedUserLogin) {
      setUserLogin(storedUserLogin);
    }
  }, []);

  // update localStorage whenever userLogin changes
  useEffect(() => {
    if (userLogin) {
      localStorage.setItem('userLogin', userLogin);
    } else {
      localStorage.removeItem('userLogin');
    }
  }, [userLogin]);

  return (
    <UserContext.Provider value={{ userLogin, setUserLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
