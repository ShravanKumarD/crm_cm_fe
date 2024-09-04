import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from './../../components/axios';

const LeadDetail = () => {
    const location = useLocation();
    const { lead } = location.state || {};

    const [activeTab, setActiveTab] = useState('general');
    const [isEditing, setIsEditing] = useState(false);

    // Initialize state for all fields
    const [editLead, setEditLead] = useState({
        name: lead?.name || '',
        phone: lead?.mobile || '',
        email: lead?.email || '',
        source: lead?.source || '',
        leadOwner: lead?.leadOwner || '',
        gender: lead?.gender || '',
        dob: lead?.dob || '',
        company: lead?.company || '',
        city: lead?.city || '',
        tags: lead?.tags || '',
        mailSent: lead?.mailSent || '',
        updatedBy: lead?.updatedBy || '',
        updatedOn: lead?.updatedOn || '',
        comment: lead?.comment || '',
        followupUpdatedBy: lead?.followupUpdatedBy || '',
        followupUpdatedOn: lead?.followupUpdatedOn || '',
        followupComment: lead?.followupComment || '',
        tasks: lead?.tasks || '',
        note: lead?.note || '',
        documents: lead?.documents || '',
    });

    if (!lead) return <div>Select a lead to see details</div>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditLead({
            ...editLead,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/lead/${lead.id}`,editLead);
            console.log('Lead updated successfully:', response);
        } catch (error) {
            console.error('Error updating lead:', error);
        }
        setIsEditing(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="card-body">
                        <p><strong>Lead ID:</strong> {lead.id}</p>
                        {['name', 'phone', 'email', 'source', 'leadOwner', 'gender', 'dob', 'company', 'city', 'tags'].map((field) => (
                            <p key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                {isEditing ? (
                                    <input
                                        type={field === 'email' ? 'email' : field === 'dob' ? 'date' : 'text'}
                                        name={field}
                                        class="form-group"
                                        value={editLead[field]}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span>{editLead[field]}</span>
                                )}
                            </p>
                        ))}
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            case 'activity':
                return (
                    <div className="card-body">
                        {['mailSent', 'updatedBy', 'updatedOn', 'comment'].map((field) => (
                            <p key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                {isEditing ? (
                                    field === 'comment' ? (
                                        <textarea
                                            name={field}
                                            value={editLead[field]}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <input
                                            type={field === 'updatedOn' ? 'date' : 'text'}
                                            name={field}
                                            value={editLead[field]}
                                            onChange={handleInputChange}
                                        />
                                    )
                                ) : (
                                    <span>{editLead[field]}</span>
                                )}
                            </p>
                        ))}
                      <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            case 'followup':
                return (
                    <div className="card-body">
                        {['followupUpdatedBy', 'followupUpdatedOn', 'followupComment'].map((field) => (
                            <p key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                {isEditing ? (
                                    field === 'followupComment' ? (
                                        <textarea
                                            name={field}
                                            value={editLead[field]}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <input
                                            type={field === 'followupUpdatedOn' ? 'date' : 'text'}
                                            name={field}
                                            value={editLead[field]}
                                            onChange={handleInputChange}
                                        />
                                    )
                                ) : (
                                    <span>{editLead[field]}</span>
                                )}
                            </p>
                        ))}
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            case 'tasks':
                return (
                    <div className="card-body">
                        <p>
                            <strong>Call on:</strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="tasks"
                                    value={editLead.tasks}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{editLead.tasks}</span>
                            )}
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            case 'note':
                return (
                    <div className="card-body">
                        <p>
                            {isEditing ? (
                                <textarea
                                    name="note"
                                    value={editLead.note}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{editLead.note}</span>
                            )}
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            case 'documents':
                return (
                    <div className="card-body">
                        <p>
                            <strong>PDF - CIBIL Bureau:</strong>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="form-group"
                                    name="documents"
                                    value={editLead.documents}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{editLead.documents}</span>
                            )}
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                        <br/>
                        {isEditing && <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="global-container row">
            <div className='col-sm-2'></div>
            <div className="col-sm-9">
                <h2>Lead Details</h2>
                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-tabs">
                            {['general', 'activity', 'followup', 'tasks', 'note', 'documents'].map(tab => (
                                <li key={tab} className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
