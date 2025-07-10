import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, setSuggestions, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.name);
        } else if (activeField === 'destination') {
            setDestination(suggestion.name);
        }
        // setPanelOpen(false);
        // setVehiclePanel(true);
    }

    return (
        <div>
            {/* Display fetched suggestions */}
            {
                suggestions && suggestions.length > 0 ? (
                    suggestions.map((elem, idx) => (
                        <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start'>
                            <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>
                            <h4 className='font-medium'>{elem.name}</h4>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400 text-center py-4">No suggestions</div>
                )
            }
        </div>
    )
}

export default LocationSearchPanel