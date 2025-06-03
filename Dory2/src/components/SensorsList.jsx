import React, { useEffect, useState } from 'react';
import { fetchSensorsForMachine } from '../api';

const SensorsList = ({ macCod, panCod }) => {
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSensors = async () => {
            try {
                const data = await fetchSensorsForMachine(macCod, panCod);
                setSensors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getSensors();
    }, [macCod, panCod]);

    if (loading) {
        return <div>Loading sensors...</div>;
    }

    if (error) {
        return <div>Error fetching sensors: {error}</div>;
    }

    return (
        <div>
            <h2>Sensors List</h2>
            <ul>
                {sensors.map(sensor => (
                    <li key={sensor.CATS_SNS}>
                        {sensor.CATS_DESC} ({sensor.CATS_UNIT})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SensorsList;