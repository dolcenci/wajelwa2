import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await API.get('/products/admin/logs');
                setLogs(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#111111' }}>Loading logs...</div>;

    const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', color: '#111111' };
    const thStyle = { padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f9fafb', color: '#111111' };
    const tdStyle = { padding: '12px', borderBottom: '1px solid #eee', color: '#111111' };

    return (
        <div style={{ padding: '40px 20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111111', margin: 0 }}>System Audit Logs</h1>
                    <Link to="/admin" style={{ padding: '10px 20px', backgroundColor: '#111111', color: '#ffffff', textDecoration: 'none', borderRadius: '6px' }}>← Back to Dashboard</Link>
                </div>

                <table style={tableStyle}>
                    <thead>
                    <tr>
                        <th style={thStyle}>Date & Time</th>
                        <th style={thStyle}>Admin Name</th>
                        <th style={thStyle}>Action</th>
                        <th style={thStyle}>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#111111' }}>No actions logged yet.</td></tr>
                    ) : (
                        logs.map(log => (
                            <tr key={log.log_id}>
                                <td style={tdStyle}>{new Date(log.created_at).toLocaleString()}</td>
                                <td style={tdStyle}>{log.full_name}</td>
                                <td style={tdStyle}>
                                        <span style={{ backgroundColor: '#e5eee5', color: '#315d38', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                            {log.action}
                                        </span>
                                </td>
                                <td style={tdStyle}>{log.details}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;