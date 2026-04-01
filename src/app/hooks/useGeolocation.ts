import { useState, useEffect } from 'react';

export const useGeolocation = () => {
    const [locationData, setLocationData] = useState({ lat: 0, lng: 0, address: '' });
    const [isLocating, setIsLocating] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setIsLocating(false);
            return;
        }

        const onSuccess = async (pos: GeolocationPosition) => {
            const { latitude, longitude } = pos.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await res.json();
                setLocationData({ lat: latitude, lng: longitude, address: data.display_name || "Address not found" });
            } catch {
                setLocationData({ lat: latitude, lng: longitude, address: "GPS Fixed (No Address)" });
            } finally {
                setIsLocating(false);
            }
        };

        const onError = (err: GeolocationPositionError) => {
            console.log('err', err)
            const messages = { 1: "Permission denied.", 2: "Location unavailable.", 3: "Request timed out." };
            setError(messages[err.code as keyof typeof messages] || "Unknown error.");
            setIsLocating(false);
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 10000 });
    }, []);

    return { ...locationData, isLocating, error };
};
