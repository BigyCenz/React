import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FreePorts = ({ panCod }) => {
    const [freePorts, setFreePorts] = useState([]);

    useEffect(() => {
        const fetchFreePorts = async () => {
            try {
                const response = await axios.get(`/api/porte/${panCod}`);
                setFreePorts(response.data);
            } catch (error) {
                console.error("Error fetching free ports:", error);
            }
        };

        fetchFreePorts();
    }, [panCod]);

    return (
        <div>
            <h2>Free Ports for Panel {panCod}</h2>
            <ul>
                {freePorts.map(port => (
                    <li key={port.PORT_COD}>
                        {port.PORT_COD} - {port.PORT_TYPE}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FreePorts;