import { useEffect, useState } from "react";
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "../components/Layout";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        userBalance();
    }, []);

    async function userBalance() {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                <Balance value={parseInt(balance)} />
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/transactions")}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        View All Transactions
                    </button>
                </div>
                <div className="mt-6">
                    <Users />
                </div>
            </div>
        </Layout>
    );
}