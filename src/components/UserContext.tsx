import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userLogin: string | null;
  userPassword: string | null;
  setUserLogin: (login: string | null) => void;
  setUserPassword: (password: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLogin, setUserLogin] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedUserLogin = localStorage.getItem('userLogin');
    const storedUserPassword = localStorage.getItem('userPassword');

    if (storedUserLogin) setUserLogin(storedUserLogin);
    if (storedUserPassword) setUserPassword(storedUserPassword);
    console.log("UserLogin was taken from localhost:", userLogin)
    console.log("UserPassword was taken from localhost:", userPassword)
  }, []);

  useEffect(() => {
    if (userLogin) {
      localStorage.setItem('userLogin', userLogin);
      console.log("UserLogin was updated in localhost:", userLogin)
    } else {
      localStorage.removeItem('userLogin');
      console.log("UserLogin was deleted in localhost")
    }

    if (userPassword) {
      localStorage.setItem('userPassword', userPassword);
      console.log("UserPassword was saved in localstorage:", userPassword)
    } else {
      localStorage.removeItem('userPassword');
      console.log("UserPassword was deleted from localstorage")
    }
  }, [userLogin, userPassword]);

  return (
    <UserContext.Provider value={{ userLogin, userPassword, setUserLogin, setUserPassword }}>
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
