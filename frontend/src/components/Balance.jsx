export const Balance = ({ value }) => {
    return <div className="flex max-w-4xl mx-auto">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {value}
        </div>
    </div>
}