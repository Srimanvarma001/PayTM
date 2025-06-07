import { TransactionHistory } from "../components/TransactionHistory";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";

export const Transactions = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <TransactionHistory />
                </div>
            </div>
        </Layout>
    );
};