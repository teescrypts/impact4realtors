"use client";

import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authenticate } from "../actions/server-actions";

const AuthContext = createContext<{
  id: string;
  email: string;
  fname: string;
  lname: string;
  unreadNotifictaionsCount: number;
  setUreadNotifictaionsCount: Dispatch<SetStateAction<number>>;
} | null>(null);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<{
    id: string;
    email: string;
    fname: string;
    lname: string;
  } | null>(null);
  const [unreadNotifictaionsCount, setUreadNotifictaionsCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const authenticateUser = useCallback(async () => {
    try {
      const result = await authenticate();

      if (result?.ok) {
        const user = result.user;
        setAdmin({
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          id: user._id,
        });

        if (result.unreadNotifictaionsCount > 0) {
          setUreadNotifictaionsCount(result.unreadNotifictaionsCount);
        }
      } else {
        router.replace("/demo/auth/demo/login");
      }
    } catch (e) {
      console.log(e);
      router.replace("/demo/auth/demo/login");
    }
  }, [router]);

  useEffect(() => {
    authenticateUser();
  }, [pathname, authenticateUser]);

  if (!admin) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <AuthContext.Provider
        value={{
          fname: admin.fname,
          lname: admin.lname,
          email: admin.email,
          id: admin.id,
          unreadNotifictaionsCount,
          setUreadNotifictaionsCount,
        }}
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
