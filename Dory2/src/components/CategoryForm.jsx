import React, { useState } from 'react';
import { createCategory } from '../api';

const CategoryForm = () => {
    const [categoryName, setCategoryName] = useState('');
    const [sensors, setSensors] = useState([{ unit: '', desc: '' }]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSensorChange = (index, event) => {
        const newSensors = [...sensors];
        newSensors[index][event.target.name] = event.target.value;
        setSensors(newSensors);
    };

    const addSensor = () => {
        setSensors([...sensors, { unit: '', desc: '' }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createCategory({ cat_name: categoryName, sensors });
            setSuccess('Category and sensors saved successfully!');
            setError(null);
            setCategoryName('');
            setSensors([{ unit: '', desc: '' }]);
        } catch (err) {
            setError('Failed to save category. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Category</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div>
                <label>Category Name:</label>
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
            </div>
            <h3>Sensors</h3>
            {sensors.map((sensor, index) => (
                <div key={index}>
                    <label>Unit:</label>
                    <input
                        type="text"
                        name="unit"
                        value={sensor.unit}
                        onChange={(e) => handleSensorChange(index, e)}
                        required
                    />
                    <label>Description:</label>
                    <input
                        type="text"
                        name="desc"
                        value={sensor.desc}
                        onChange={(e) => handleSensorChange(index, e)}
                        required
                    />
                </div>
            ))}
            <button type="button" onClick={addSensor}>Add Sensor</button>
            <button type="submit">Save Category</button>
        </form>
    );
};

export default CategoryForm;