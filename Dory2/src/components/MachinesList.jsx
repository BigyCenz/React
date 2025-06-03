import React, { useEffect, useState } from 'react';
import { fetchMachines } from '../api';

const MachinesList = ({ clientId }) => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMachines = async () => {
            try {
                const data = await fetchMachines(clientId);
                setMachines(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMachines();
    }, [clientId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Machines List</h2>
            <ul>
                {machines.map(machine => (
                    <li key={machine.MAC_COD}>
                        {machine.MAC_NAME} (Category: {machine.MAC_CAT})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MachinesList;