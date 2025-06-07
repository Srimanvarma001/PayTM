export const Appbar = ({ firstName }) => {
    // Add null check before accessing firstName[0]
    const logo = firstName ? firstName[0].toUpperCase() : "U";

    return <div className="shadow h-14 flex justify-between rounded-3xl max-w-5xl mx-auto mt-1">
        <div className="flex text-blue-700 flex-col justify-center h-full ml-4 text-xl pl-3">
            PayTM
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                {firstName || "Loading..."}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {logo}
                </div>
            </div>
        </div>
    </div>
}