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
import { authenticateAgent } from "../actions/server-actions";
import LoadingComponent from "../component/_loading";

const AuthContext = createContext<{
  id: string;
  email: string;
  fname: string;
  lname: string;
  isBroker: boolean;
  agent: { isAgent: boolean; admin: string };
  unreadNotifictaionsCount: number;
  setUreadNotifictaionsCount: Dispatch<SetStateAction<number>>;
} | null>(null);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<{
    id: string;
    email: string;
    fname: string;
    lname: string;
    isBroker: boolean;
    agent: { isAgent: boolean; admin: string };
  } | null>(null);
  const [unreadNotifictaionsCount, setUreadNotifictaionsCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const authenticateUser = useCallback(async () => {
    try {
      const result = await authenticateAgent();

      if (result?.ok) {
        const user = result.user;
        setAdmin({
          email: user.email,
          fname: user.fname,
          lname: user.lname,
          id: user._id,
          isBroker: user.isBroker,
          agent: user.agent,
        });

        if (result.unreadNotifictaionsCount > 0) {
          setUreadNotifictaionsCount(result.unreadNotifictaionsCount);
        }
      } else {
        router.replace(`/demo/auth/login?type=broker`);
      }
    } catch (e) {
      console.log(e);
      router.replace(`/demo/auth/login?type=broker`);
    }
  }, [router]);

  useEffect(() => {
    authenticateUser();
  }, [pathname, authenticateUser]);

  if (!admin) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <AuthContext.Provider
        value={{
          fname: admin.fname,
          lname: admin.lname,
          email: admin.email,
          id: admin.id,
          isBroker: admin.isBroker,
          agent: admin.agent,
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
