import React, { useEffect, useState } from 'react';
import { fetchReports } from '../api';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReports = async () => {
            try {
                const data = await fetchReports();
                setReports(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getReports();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Reports</h1>
            <table>
                <thead>
                    <tr>
                        <th>Report Code</th>
                        <th>Panel</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>RX Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.REP_COD}>
                            <td>{report.REP_COD}</td>
                            <td>{report.PAN_NAME}</td>
                            <td>{report.REP_TIME}</td>
                            <td>{report.LOC_NAME}</td>
                            <td>{report.PAN_RX ? 'Enabled' : 'Disabled'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;