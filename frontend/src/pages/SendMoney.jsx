import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react"; // Remove useEffect since we won't need it

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [transferring, setTransferring] = useState(false);
    const [error, setError] = useState("");

    async function initiateTransfer() {
        try {
            setError("");
            setTransferring(true);

            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: parseInt(amount)
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            if (response.data) {
                alert("Transfer successful");
                // Redirect immediately on success
                navigate("/dashboard");
            } else {
                setError("Transfer failed");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Transfer failed");
        } finally {
            setTransferring(false);
        }
    }

    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-semibold">{name}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Amount (in Rs)
                            </label>
                            <input
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError(""); // Clear error when user types
                                }}
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                id="amount"
                                placeholder="Enter amount"
                            />
                        </div>
                        <button
                            onClick={initiateTransfer}
                            disabled={transferring || amount <= 0}
                            className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white disabled:bg-gray-300"
                        >
                            {transferring ? "Processing..." : "Initiate Transfer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
};