import { MapPin } from 'lucide-react';
import React from 'react'

const LocationErrorDisplay = ({ locationError }: { locationError: string }) => {
    return (
        <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-2">Location Required</h2>
            <p className="text-red-700 mb-6">{locationError}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
            >
                Try Again / Grant Permission
            </button>
        </div>
    );
}

export default LocationErrorDisplay