
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { users } from "@/app/indexType";

import withAdminAuth from "@/app/components/withAdminAuth";

const ProfilePage = () => {
  const [user, setUser] = useState<users | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">User Profile</h1>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-gray-700 font-bold">Username:</p>
          <p>{user.userName}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-bold">Email:</p>
          <p>{user.email}</p>
        </div>
        {/* <div className="mb-4">
          <p className="text-gray-700 font-bold">Role:</p>
          <p>{user.}</p>
        </div> */}
      </div>
    </div>
  );
};

export default withAdminAuth(ProfilePage);
