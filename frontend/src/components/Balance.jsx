export const Balance = ({ value }) => {
    return <div className="shadow-lg rounded-lg p-6 bg-white max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
            <div className="font-bold text-lg">Your balance</div>
            <div className="font-semibold text-lg">Rs {value}</div>
        </div>
    </div>
}