import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createLocation } from '../api'; // Assuming you have a function to handle API calls

const LocationForm = () => {
    const [locName, setLocName] = useState('');
    const [locCli, setLocCli] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLocation({ loc_name: locName, loc_cli: locCli });
            history.push('/'); // Redirect to the dashboard or another page after successful submission
        } catch (error) {
            console.error('Error creating location:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="locName">Location Name:</label>
                <input
                    type="text"
                    id="locName"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="locCli">Client ID:</label>
                <input
                    type="text"
                    id="locCli"
                    value={locCli}
                    onChange={(e) => setLocCli(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Save Location</button>
        </form>
    );
};

export default LocationForm;