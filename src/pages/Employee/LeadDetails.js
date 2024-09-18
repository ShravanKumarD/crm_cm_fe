import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from './../../components/axios';
import { useNavigate } from 'react-router-dom';

const LeadDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lead } = location.state || {};
    const [activeTab, setActiveTab] = useState('general');
    const [isEditing, setIsEditing] = useState(false);
    const [task,setTask]=useState([]);

    // Initialize state for all fields
    const [editLead, setEditLead] = useState({
        name: lead?.name || '',
        phone: lead?.phone || '',
        email: lead?.email || '',
        source: lead?.leadSource || '',
        // leadOwner: lead?.leadOwner || '',
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

    const user = JSON.parse(localStorage.getItem('user')) || {};
    useEffect(()=>{
        fetchActivity()
    },[])
    if (!lead) return <div>Select a lead to see details</div>;
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditLead({
            ...editLead,
            [name]: value,
        });
    };

    const fetchActivity = async () => {
        console.log('test');
        
        try {
            const response = await axios.get(`http://localhost:3000/task/${user.id}`);
            
            if (response && response.data) {
                // Filter the tasks by leadId
                const filteredTasks = response.data.filter(taskItem => taskItem.leadId === lead.id);
    
                setTask(filteredTasks); 
                console.log(filteredTasks, 'filtered tasks by leadId in activity');
            }
        } catch (error) {
            console.error('Error fetching task data:', error.message);
        }
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
const handleNavigate=async ()=>{
    navigate('/add-task-employee',{state:{lead}})
}
    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="card-body">
                    <h4 className="mb-3">Lead Information</h4>
                    
                    <div className="row">
                        {['name', 'phone', 'email', 'source', 'gender', 'dob', 'company', 'city', 'tags'].map((field) => (
                            <div className="col-md-6 mb-3" key={field}>
                                <label className="form-label"><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong></label>
                                {isEditing ? (
                                    <input
                                        type={field === 'email' ? 'email' : field === 'dob' ? 'date' : 'text'}
                                        name={field}
                                        className="form-control"
                                        value={editLead[field]}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p className="form-control-plaintext">{editLead[field]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary btn-lg" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit Lead'}
                        </button>
                
                        {isEditing && (
                            <button className="btn btn-primary btn-lg" onClick={handleSave}>
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
                
                );
                case 'activity':
                    return (
                        <div className="card-body">
                            {/* {['mailSent', 'updatedBy', 'updatedOn', 'comment'].map((field) => (
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
                            ))} */}
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {/* <th>Task ID</th> */}
                                        <th>Lead Name</th>
                                        <th>Status</th>
                                        <th>Task</th>
                                        <th>Follow Up</th>
                                        <th>Notes</th>
                                        <th>Documnets Collected</th>
                                        <th>Created By</th>
                                        <th>Created On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {task.length > 0 ? (
                                        task.map((taskItem) => (
                                            <tr key={taskItem.id}>
                                                {/* <td>{taskItem.id}</td> */}
                                                <td>{taskItem.lead.name}</td>
                                              
                                                <td>{taskItem.status}</td>
                                                <td>{taskItem.actionType}</td>
                                                <td>
                    {taskItem.followUp
                        ? `${new Date(taskItem.followUp).toLocaleDateString()} ${new Date(taskItem.followUp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Not Available'}
                </td>
                <td>{taskItem.description}</td>
                                                <td>{taskItem.docsCollected}</td>
                                                <td>{taskItem.user.name}</td>
                                                <td>                    {  taskItem.createdDate
                        ? `${new Date(taskItem.createdDate).toLocaleDateString()} ${new Date(taskItem.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Not Availabale'}</td>

                          
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No tasks found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                
                            <button className="btn btn-primary btn-sm" onClick={() => handleNavigate(lead)}>
                                {isEditing ? 'Cancel' : 'Add Activity'}
                            </button>
                            <br />
                            {isEditing && <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Changes</button>}
                        </div>
                    );
                
                
            // case 'note':
            //     return (
            //         <div className="card-body">
            //             <p>
            //                 {isEditing ? (
            //                     <textarea
            //                         name="note"
            //                         value={editLead.note}
            //                         onChange={handleInputChange}
            //                     />
            //                 ) : (
            //                     <span>{editLead.note}</span>
            //                 )}
            //             </p>
            //             <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(!isEditing)}>
            //                 {isEditing ? 'Cancel' : 'Edit'}
            //             </button>
            //             <br/>
            //             {isEditing && <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Changes</button>}
            //         </div>
            //     );
            // case 'documents':
            //     return (
            //         <div className="card-body">
            //             <p>
            //                 <strong>PDF - CIBIL Bureau:</strong>
            //                 {isEditing ? (
            //                     <input
            //                         type="text"
            //                         className="form-group"
            //                         name="documents"
            //                         value={editLead.documents}
            //                         onChange={handleInputChange}
            //                     />
            //                 ) : (
            //                     <span>{editLead.documents}</span>
            //                 )}
            //             </p>
            //             <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(!isEditing)}>
            //                 {isEditing ? 'Cancel' : 'Edit'}
            //             </button>
            //             <br/>
            //             {isEditing && <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Changes</button>}
            //         </div>
            //     );
            default:
                return null;
        }
    };

    return (
        <div className="global-container row">
            {/* <div className='col-sm-2'></div> */}
            <div className="col-sm-12">
                <h2>{lead.name}</h2>
                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-tabs">
                            {['general', 'activity'].map(tab => (
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
