import React from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const LandmarkInput = ({ formData, setFormData }) => {
    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setFormData({
            ...formData,
            location: {
                ...formData.location,
                landmark: value,
                coordinates: {
                    lat: latLng.lat,
                    lng: latLng.lng,
                },
            },
        });
    };

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="beforeInteractive"
            />
            <PlacesAutocomplete
                value={formData.location.landmark}
                onChange={(value) => setFormData({ ...formData, location: { ...formData.location, landmark: value } })}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="mb-4">
                        <label htmlFor="location.landmark" className="block text-emerald-700 text-sm font-bold mb-2">Landmark:</label>
                        <input
                            {...getInputProps({
                                placeholder: 'Search for a landmark...',
                                className: 'shadow border rounded w-full py-2 px-3 text-grey-darker',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => (
                                <div {...getSuggestionItemProps(suggestion)} className="suggestion-item">
                                    <span>{suggestion.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        </>
    );
};

export default dynamic(() => Promise.resolve(LandmarkInput), { ssr: false });
