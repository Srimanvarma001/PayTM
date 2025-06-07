import { Appbar } from "./Appbar";
import { useEffect, useState } from "react";
import axios from "axios";

export const Layout = ({ children }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        fetchUserProfile();
    }, []);

    async function fetchUserProfile() {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/user/me", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Appbar firstName={firstName} lastName={lastName} />
            <div className="max-w-4xl mx-auto p-4">
                {children}
            </div>
        </div>
    );
};