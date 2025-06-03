import React, { useEffect, useState } from 'react';
import { getAssociations, addAssociation, deleteAssociation } from '../api';

const SensorAssociations = () => {
    const [associations, setAssociations] = useState([]);
    const [newAssociation, setNewAssociation] = useState({
        ASS_PAN: '',
        ASS_PORT: '',
        ASS_MAC: '',
        ASS_SNS: ''
    });

    useEffect(() => {
        fetchAssociations();
    }, []);

    const fetchAssociations = async () => {
        const data = await getAssociations();
        setAssociations(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAssociation((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAssociation = async (e) => {
        e.preventDefault();
        await addAssociation(newAssociation);
        fetchAssociations();
        setNewAssociation({
            ASS_PAN: '',
            ASS_PORT: '',
            ASS_MAC: '',
            ASS_SNS: ''
        });
    };

    const handleDeleteAssociation = async (pan, port) => {
        await deleteAssociation(pan, port);
        fetchAssociations();
    };

    return (
        <div>
            <h2>Sensor Associations</h2>
            <form onSubmit={handleAddAssociation}>
                <input type="text" name="ASS_PAN" placeholder="Panel Code" value={newAssociation.ASS_PAN} onChange={handleChange} required />
                <input type="text" name="ASS_PORT" placeholder="Port Code" value={newAssociation.ASS_PORT} onChange={handleChange} required />
                <input type="text" name="ASS_MAC" placeholder="MAC Address" value={newAssociation.ASS_MAC} onChange={handleChange} required />
                <input type="text" name="ASS_SNS" placeholder="Sensor Number" value={newAssociation.ASS_SNS} onChange={handleChange} required />
                <button type="submit">Add Association</button>
            </form>
            <ul>
                {associations.map((assoc) => (
                    <li key={`${assoc.ASS_PAN}-${assoc.ASS_PORT}`}>
                        {`Panel: ${assoc.ASS_PAN}, Port: ${assoc.ASS_PORT}, MAC: ${assoc.ASS_MAC}, Sensor: ${assoc.ASS_SNS}`}
                        <button onClick={() => handleDeleteAssociation(assoc.ASS_PAN, assoc.ASS_PORT)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SensorAssociations;