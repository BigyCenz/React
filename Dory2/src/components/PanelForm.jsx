import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createPanel, updatePanel, getPanelById } from '../api';

const PanelForm = () => {
    const { id } = useParams();
    const [panelData, setPanelData] = useState({
        name: '',
        location: '',
        // Add other panel fields as necessary
    });

    useEffect(() => {
        if (id) {
            const fetchPanelData = async () => {
                const data = await getPanelById(id);
                setPanelData(data);
            };
            fetchPanelData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPanelData({ ...panelData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await updatePanel(id, panelData);
        } else {
            await createPanel(panelData);
        }
        // Redirect or show success message
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={panelData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    name="location"
                    value={panelData.location}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Add other fields as necessary */}
            <button type="submit">{id ? 'Update Panel' : 'Create Panel'}</button>
        </form>
    );
};

export default PanelForm;