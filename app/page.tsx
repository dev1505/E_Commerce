'use client';
import React, { useState } from "react";

export default function Home() {

  const [userData, setUserData] = useState({ name: "", password: "" })
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
  }

  return (
    <>
      <div>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div>
            Name - <input type="text" value={userData.name} onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }} required />
          </div>
          <br />
          <div>
            Password - <input type="password" value={userData.password} onChange={(e) => { setUserData({ ...userData, password: e.target.value }) }} required />
          </div>
          <div>
            <button type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
