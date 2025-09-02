'use client';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { FormEvent, ReactElement, useState } from 'react';

export default function Login(): ReactElement {

    const [userCred, setUserCred] = useState({ email: "", password: "" });
    async function handleLoginSubmit(e: FormEvent) {
        e.preventDefault();
        if (userCred.email !== "" && userCred.password !== "") {
            const response = await axios.post("/api/userlogin", {
                email: userCred.email,
                password: userCred.password,
            })
        }
        redirect("/");
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
                <div className="w-full max-w-md rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-200 mb-4 text-center">Login</h2>
                    <form
                        className="flex flex-col"
                        onSubmit={(e) => handleLoginSubmit(e)}
                    >
                        <input
                            value={userCred.email}
                            onChange={(e) => setUserCred({ ...userCred, email: e.target.value })}
                            placeholder="Email address"
                            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                            type="email"
                            required={true}
                        />
                        <input
                            value={userCred.password}
                            onChange={(e) => setUserCred({ ...userCred, password: e.target.value })}
                            placeholder="Password"
                            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                            type="password"
                            required={true}
                        />
                        <Link href={"/signup"}>
                            <div className="flex items-center justify-between flex-wrap">
                                <p className="text-white mt-4 text-sm"> Don't have an account? <span className='text-blue-300'>Signup</span></p>
                            </div>
                        </Link>
                        <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}