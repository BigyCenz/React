import React, { useEffect, useState } from 'react';
import { getMachines, getFreePorts, getReports } from '../api';

const Dashboard = () => {
    const [machines, setMachines] = useState([]);
    const [freePorts, setFreePorts] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const machinesData = await getMachines();
                const freePortsData = await getFreePorts();
                const reportsData = await getReports();

                setMachines(machinesData);
                setFreePorts(freePortsData);
                setReports(reportsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <section>
                <h2>Machines</h2>
                <ul>
                    {machines.map(machine => (
                        <li key={machine.MAC_COD}>{machine.MAC_NAME}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Free Ports</h2>
                <ul>
                    {freePorts.map(port => (
                        <li key={port.PORT_COD}>{port.PORT_TYPE}</li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Reports</h2>
                <ul>
                    {reports.map(report => (
                        <li key={report.REP_COD}>{report.REP_TIME}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;