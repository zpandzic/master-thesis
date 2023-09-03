// import AsyncStorage from '@react-native-async-storage/async-storage';

import jwt_decode from 'jwt-decode';
import { createContext, useState } from 'react';
import React from 'react';
import { RoleEnum } from '../enums';

type ContextType = {
  token: string | null;
  authenticate: ({ jwt }: any) => void;
  userData: {
    email: string;
    userId: number;
    username: string;
    role_id: number;
  } | null;
  logout: () => void;
  isAdmin: boolean;
};
export const UserContext = createContext<ContextType>({
  token: null,
  authenticate: ({ jwt }: any) => {},
  userData: null,
  logout: () => {},
  isAdmin: false,
});

function UserContextProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    email: string;
    userId: number;
    username: string;
    role_id: number;
  } | null>(null);

  const isAdmin = userData?.role_id === RoleEnum.ADMIN;

  async function authenticate(jwt: string) {
    let decoded = jwt_decode<any>(jwt);

    setToken(jwt);
    localStorage.setItem('token', jwt);
    setUserData(decoded);
  }

  async function logout() {
    setToken(null);
    localStorage.removeItem('token');
    setUserData(null);
  }

  const value: ContextType = {
    token: token,
    userData,
    authenticate,
    logout,
    isAdmin,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
