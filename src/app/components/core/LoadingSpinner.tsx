import React from 'react'

const LoadingSpinner = ({ message }: {
    message: string
}) => {
    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            <p className="text-gray-500">Evidence submission requires verified location data.</p>
        </div>
    );
}

export default LoadingSpinner