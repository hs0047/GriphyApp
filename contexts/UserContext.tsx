// contexts/userContext.tsx

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface User {
  uid: string;
  email: string;
  // Add other profile fields as needed
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up the Firebase authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          // Add other fields as needed
        });
      } else {
        setUser(null);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const logout = () => {
    // Firebase logout logic
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
