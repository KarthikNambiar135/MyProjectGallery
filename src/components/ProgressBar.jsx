function ProgressBar({completed, total}) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
            ></div>
         </div>
    )
}

export default ProgressBar;