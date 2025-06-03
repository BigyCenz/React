import React, { useState, useEffect } from 'react';
import { addMachine, getMachines, updateMachine } from '../api';

const MachineForm = ({ machineId }) => {
    const [machineData, setMachineData] = useState({
        mac_name: '',
        mac_cat: '',
        mac_cli: '',
        mac_loc: ''
    });

    useEffect(() => {
        if (machineId) {
            const fetchMachineData = async () => {
                const response = await getMachines(machineId);
                setMachineData(response);
            };
            fetchMachineData();
        }
    }, [machineId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMachineData({ ...machineData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (machineId) {
            await updateMachine(machineId, machineData);
        } else {
            await addMachine(machineData);
        }
        // Optionally reset the form or redirect
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Machine Name:</label>
                <input
                    type="text"
                    name="mac_name"
                    value={machineData.mac_name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Machine Category:</label>
                <input
                    type="text"
                    name="mac_cat"
                    value={machineData.mac_cat}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Client:</label>
                <input
                    type="text"
                    name="mac_cli"
                    value={machineData.mac_cli}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location:</label>
                <input
                    type="text"
                    name="mac_loc"
                    value={machineData.mac_loc}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{machineId ? 'Update Machine' : 'Add Machine'}</button>
        </form>
    );
};

export default MachineForm;