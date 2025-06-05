import axios from "axios";
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/signin");
                    return;
                }
            
                
                await userBalance();
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
                if (error.response?.status === 403) {
                    navigate("/signin");
                }
            }
        }

        fetchData();
    }, [navigate]);

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
    

    

   

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={parseInt(balance)} />
            <Users />
        </div>
    </div>;
}