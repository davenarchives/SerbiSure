import React, { createContext, useContext, useState } from 'react';

type UserData = {
  firstName: string;
  middleName: string;
  lastName: string;
};

type UserContextType = {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  updateUser: (data: Partial<UserData>) => void;
  getFirstNameOnly: () => string;
  getFullName: () => string;
};

const defaultUser: UserData = {
  firstName: 'Daven Austhine',
  middleName: 'Santos',
  lastName: 'Sumagang',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData>(defaultUser);

  const updateUser = (data: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  /**
   * Returns only the first word of the user's first name.
   * Example: "Daven Austhine" -> "Daven"
   */
  const getFirstNameOnly = (): string => {
    const raw = user.firstName || 'Daven';
    const firstWord = raw.trim().split(' ')[0];
    return firstWord || 'Daven';
  };

  /**
   * Returns the full name constructed from first, middle, and last name.
   * Example: "Daven Austhine Santos Sumagang" or "Daven Austhine Sumagang"
   */
  const getFullName = (): string => {
    const parts = [user.firstName, user.middleName, user.lastName].map((s) => s?.trim()).filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Daven Austhine Sumagang';
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, getFirstNameOnly, getFullName }}>
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
