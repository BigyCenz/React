import React, { useState } from 'react';
import axios from 'axios';

const ClientForm = ({ clientData, onSubmitSuccess }) => {
    const [clientName, setClientName] = useState(clientData ? clientData.CLI_NAME : '');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = clientData
                ? await axios.put(`/api/clienti/${clientData.CLI_COD}`, { CLI_NAME: clientName })
                : await axios.post('/api/clienti', { CLI_NAME: clientName });

            onSubmitSuccess(response.data);
        } catch (err) {
            setError('An error occurred while saving the client data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{clientData ? 'Edit Client' : 'Create Client'}</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label htmlFor="clientName">Client Name:</label>
                <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{clientData ? 'Update Client' : 'Create Client'}</button>
        </form>
    );
};

export default ClientForm;