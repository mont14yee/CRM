import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ProfileContextValue {
  name: string;
  email: string;
  businessName: string;
  avatarUrl: string;
  updateProfile: (updates: Partial<ProfileContextValue>) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useLocalStorage('conneq-profile-name', 'John Snow');
  const [email, setEmail] = useLocalStorage('conneq-profile-email', 'johnsnow@example.com');
  const [businessName, setBusinessName] = useLocalStorage('conneq-profile-business', 'My Business');
  const [avatarUrl, setAvatarUrl] = useLocalStorage('conneq-profile-avatar', 'https://i.pravatar.cc/150?u=a042581f4e29026704d');

  const updateProfile = (updates: Partial<ProfileContextValue>) => {
    if (updates.name !== undefined) setName(updates.name);
    if (updates.email !== undefined) setEmail(updates.email);
    if (updates.businessName !== undefined) setBusinessName(updates.businessName);
    if (updates.avatarUrl !== undefined) setAvatarUrl(updates.avatarUrl);
  };

  return (
    <ProfileContext.Provider value={{ name, email, businessName, avatarUrl, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
