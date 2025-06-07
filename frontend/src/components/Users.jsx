import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/bulk", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                if (response.data.users) {
                    const currentUserId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).userId;
                    const filteredUsers = response.data.users.filter(user => user._id !== currentUserId);
                    setUsers(filteredUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div className="space-y-2">
                {users
                    .filter(user =>
                        user.firstName.toLowerCase().includes(filter.toLowerCase()) ||
                        user.lastName.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map(user => (
                        <User key={user._id} user={user} />
                    ))
                }
            </div>
        </>
    );
}

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-12">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center h-12">
                <button
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${user.firstName}`);
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Send Money
                </button>
            </div>
        </div>
    );
}