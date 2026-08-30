import re

with open('src/context/ProfileContext.tsx', 'r') as f:
    content = f.read()

new_content = """import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UserProfile } from '../types';

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile>('conneq-profile', {
    name: 'John Snow',
    email: 'johnsnow@example.com',
    businessName: 'My Business',
    avatarSeed: 'a042581f4e29026704d'
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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
"""

with open('src/context/ProfileContext.tsx', 'w') as f:
    f.write(new_content)

