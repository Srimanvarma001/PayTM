import { useState, useEffect } from 'react';
import axios from 'axios';

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("http://localhost:3000/api/v1/account/transactions", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            console.log("Transaction response:", response.data); // Debug log

            if (response.data && Array.isArray(response.data.transactions)) {
                setTransactions(response.data.transactions);
            } else {
                throw new Error("Invalid transaction data received");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (!transactions.length) {
        return <div className="text-gray-500 text-center py-4">No transactions yet</div>;
    }

    return (
        <div className="space-y-4">
            {transactions.map(transaction => (
                <div key={transaction._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                        <div>
                            <span className="text-gray-600">
                                {transaction.type === 'credit' ? 'Received from' : 'Sent to'}
                            </span>
                            <span className="font-medium ml-2">{transaction.with}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}