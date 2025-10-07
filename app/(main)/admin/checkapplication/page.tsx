'use client'
import CommonApiCall from "@/app/commonfunctions/CommonApiCall";
import withAdminAuth from "@/app/components/withAdminAuth";
import { users } from "@/app/indexType";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FiXCircle } from 'react-icons/fi';
import { RxCrossCircled } from "react-icons/rx";

function CheckApplications() {
    const [applications, setApplications] = useState<users[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function fetchApplications() {
        try {
            const response = await CommonApiCall("/api/user/checkapplications", { method: "GET" });
            if (response.success) {
                setApplications(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to fetch applications.");
        }
    }

    async function approveApplication(userId: ObjectId | undefined, approved: boolean) {
        try {
            const response = await CommonApiCall("/api/user/approval", {
                method: "POST",
                data: { userId, approved }
            });
            if (response.success) {
                setApplications(applications.filter(app => app._id !== userId));
                alert(response.message);

            } else {
                alert(response.message);
            }
        } catch (err) {
            alert("Failed to approve application.");
        }
    }

    useEffect(() => {
        fetchApplications();
    }, []);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-red-500 text-2xl font-semibold flex items-center">
                    <FiXCircle className="mr-2" /> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Applications</h1>
                {applications.length === 0 ? (
                    <div className="text-center text-gray-500 text-xl">
                        No pending applications.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
                        {applications.map((app, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-between items-center text-center">
                                    <div className="p-3 rounded-full bg-blue-100 flex items-center justify-center">
                                        <div className="text-2xl font-bold text-blue-500">{app.userName}</div>
                                    </div>
                                    <p className="text-gray-500">{app.email}</p>

                                    <CiCircleCheck
                                        onClick={() => approveApplication(app?._id, true)}
                                        title="Approve"
                                        className="text-4xl bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center"
                                    />
                                    <RxCrossCircled
                                        onClick={() => approveApplication(app?._id, false)}
                                        title="Decline"
                                        className="text-4xl bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAdminAuth(CheckApplications);