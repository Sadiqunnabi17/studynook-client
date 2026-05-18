"use client";
import { createContext, useContext } from "react";
import { useSession, signOut } from "next-auth/react";

const AuthContext = createContext({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading: status === "loading",
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}