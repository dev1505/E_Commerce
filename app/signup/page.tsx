'use client';
import axios from 'axios';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useState } from 'react';
import CommonApiCall from '../commonfunctions/CommonApiCall';

export default function Signup(): ReactElement {

    const [userCred, setUserCred] = useState({ email: "", password: "", userName: "" });
    const router = useRouter();
    async function handleSignupSubmit(e: FormEvent) {
        e.preventDefault();
        const { email, password, userName } = userCred;
        if (!email || !password || !userName) {
            alert('All fields are required.');
            return;
        }
        const response = await CommonApiCall('/api/adduser', {
            method: 'POST',
            data: { email, password, userName },
        });
        if (response?.success) {
            router.push('/'); // client-side navigation
        } else {
            alert(response?.message || 'Signup failed. Please try again.');
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
                <div className="w-full max-w-md rounded-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-200 mb-4 text-center">Signup</h2>
                    <form
                        onSubmit={(e) => handleSignupSubmit(e)}
                        className="flex flex-col"
                    >
                        <input
                            value={userCred.userName}
                            onChange={(e) => setUserCred({ ...userCred, userName: e.target.value })}
                            placeholder="Username"
                            className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                            type="text"
                            required={true}
                        />
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
                        <Link href={"/login"}>
                            <div className="flex items-center justify-between flex-wrap">
                                <p className="text-white mt-4 text-sm"> Already have an account? <span className='text-blue-300'>Login</span></p>
                            </div>
                        </Link>
                        <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" type="submit">SignUp</button>
                    </form>
                </div>
            </div>
        </>
    );
}