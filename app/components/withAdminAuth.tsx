"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { users } from "@/app/indexType";

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const [user, setUser] = useState<users | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/api/user");
          setUser(response.data.data);
          if (response.data.data.isSuperuser === false && response.data.data.isAdmin === false) {
            router.push("/");
          }
        } catch (error) {
          router.push("/");
        } finally {
          setLoading(false);
        }
      };
      checkAuth();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (user?.isAdmin === false && user?.isSuperuser === false) {
      return null;
    }

    return <WrappedComponent user={user} {...props} />;
  };

  return Wrapper;
};

export default withAdminAuth;
