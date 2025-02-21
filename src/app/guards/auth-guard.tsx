"use client";

import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authenticate } from "../actions/server-actions";

const AuthContext = createContext<{
  email: string;
  fname: string;
  lname: string;
} | null>(null);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<{
    email: string;
    fname: string;
    lname: string;
  } | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const authenticateUser = useCallback(async () => {
    try {
      const result = await authenticate();

      if (result?.ok) {
        const user = result.user;
        setAdmin({ email: user.email, fname: user.fname, lname: user.lname });
      } else {
        router.replace("/demo/auth/demo/login");
      }
    } catch (e) {
      router.replace("/demo/auth/demo/login");
    }
  }, [pathname]);

  useEffect(() => {
    authenticateUser();
  }, [pathname]);

  if (!admin) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <AuthContext.Provider
        value={{ fname: admin.fname, lname: admin.lname, email: admin.email }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export const useUserData = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserData must be used within an AuthProvider");
  }
  return context;
};
