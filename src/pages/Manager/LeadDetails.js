import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import axios from "./../../components/axios";
import EmployeeSidebar from "../../components/Sidebar/EmployeeSidebar";
import "./../../App.css";

const LeadDetail = () => {
  const { state: { lead } = {} } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [activeTab, setActiveTab] = useState("Basic Info");
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState([]);
  const [editLead, setEditLead] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    source: lead?.leadSource || "",
    gender: lead?.gender || "",
    dob: lead?.dob || "",
    company: lead?.company || "",
    city: lead?.city || "",
    tags: lead?.tags || "",
    mailSent: lead?.mailSent || "",
    updatedBy: lead?.updatedBy || "",
    updatedOn: lead?.updatedOn || "",
    comment: lead?.comment || "",
    followupUpdatedBy: lead?.followupUpdatedBy || "",
    followupUpdatedOn: lead?.followupUpdatedOn || "",
    followupComment: lead?.followupComment || "",
    tasks: lead?.tasks || "",
    note: lead?.note || "",
    documents: lead?.documents || "",
  });
  const [data, setData] = useState({ loanReports: [], creditReports: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (lead) fetchActivity();
  }, [lead]);

  useEffect(() => {
    fetchReports();
  }, [user?.id]);
  const fetchReports = async () => {
    console.log(lead, "leadd");
    if (!lead?.id) {
      return;
    }
    try {
      const loanReportsPromise = axios.get(`/loans-reports/${lead?.id}`);
      const creditReportsPromise = axios.get(`/credit-reports/`);
      const [loanReportsResponse, creditReportsResponse] = await Promise.all([
        loanReportsPromise,
        creditReportsPromise,
      ]);
      // Set the fetched data
      setData({
        loanReports: loanReportsResponse.data,
        creditReports: creditReportsResponse.data,
      });
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditLead((prev) => ({ ...prev, [name]: value }));
  };

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`/task/${user.id}`);
      if (response?.data) {
        const filteredTasks = response.data.filter(
          (taskItem) => taskItem.leadId === lead.id
        );
        setTask(filteredTasks.reverse());
      }
    } catch (error) {
      console.error("Error fetching task data:", error.message);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    console.log(newStatus,"newStatusnewStatusv")
    try {
      await axios.put(`/task/${taskId}`, { taskStatus: newStatus, userId: user.id, leadId: lead.id });
      setTask((prevTasks) =>
        prevTasks.map((taskItem) =>
          taskItem.id === taskId ? { ...taskItem, taskStatus: newStatus } : taskItem
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error.message);
    } 
  };

  const handleSave = async () => {
    try {
      await axios.put(`/lead/${lead.id}`, editLead);
      alert('lead details updated successfully.')
      setIsEditing(false);
      fetchActivity();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/add-task-employee", { state: { lead } });
  };

  const renderTabContent = () => {
    if (activeTab === "Basic Info") {
      return (
        <div className="card-body">
          <h4 className="mb-3">Lead Information</h4>
          <div className="row">
            {["name", "phone", "email", "source", "gender", "dob", "company", "city", "tags"].map((field) => (
              <div className="col-md-6 mb-3" key={field}>
                <label className="form-label">
                  <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                </label>
                {isEditing ? (
                  <input
                    type={field === "email" ? "email" : field === "dob" ? "date" : "text"}
                    name={field}
                    className="form-control"
                    value={editLead[field]}
                    onChange={handleInputChange}
                    readOnly={field === "phone"}
                  />
                ) : (
                  <p className="form-control-plaintext">{editLead[field]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Lead"}
            </button>
            {isEditing && (
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      );
    } else if (activeTab === "activity") {
      return (
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Lead Id</th>
                <th>Lead Name</th>
                <th>Status</th>
                <th>Task</th>
                <th>Follow Up</th>
                <th>Notes</th>
                <th>Documents Collected</th>
                <th>Created By</th>
                <th>Created On</th>
                <th>Task Status</th>
              </tr>
            </thead>
            <tbody>
              {task.length > 0 ? (
                task.map((taskItem) => (
                  <tr key={taskItem.id}>
                    <td>{taskItem.leadId}</td>
                    <td>{taskItem.lead.name}</td>
                    <td>{taskItem.status}</td>
                    <td>{taskItem.actionType}</td>
                    <td>{taskItem.followUp ? new Date(taskItem.followUp).toLocaleString() : "Not Available"}</td>
                    <td>{taskItem.description}</td>
                    <td>{taskItem.docsCollected}</td>
                    <td>{taskItem.user.name}</td>
                    <td>{taskItem.createdDate ? new Date(taskItem.createdDate).toLocaleString() : "Not Available"}</td>
                    <td>
                      <Form.Control
                        as="select"
                        value={taskItem.taskStatus}
                        onChange={(e) => handleTaskStatusChange(taskItem.id, e.target.value)}
                        className="dropdownText"
                      >
                        <option value="">{taskItem.taskStatus}</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </Form.Control>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="btn btn-primary btn-sm" onClick={handleNavigate}>
            {isEditing ? "Cancel" : "Add Activity"}
          </button>
        </div>
      );
    }else if(activeTab === "Loan Report"){
      return(
      <div className="card-body">
         <div className="col-sm-8">
                      <p>
                        <strong>Loan Report</strong>
                      </p>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Loan Type</th>
                            <th>Bank Name</th>
                            <th>Loan Amount</th>
                            <th>EMI</th>
                            <th>Outstanding</th>
                          
                          </tr>
                        </thead>
                        <tbody>
                          {data.loanReports.map((loan) => (
                            <tr key={loan.id}>
                              <td>{loan.loanType}</td>
                              <td>{loan.bankName}</td>
                              <td>{loan.loanAmount}</td>
                              <td>{loan.emi}</td>
                              <td>{loan.outstanding}</td> 
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>

                            </td>
                            <td>
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>
                                {data.loanReports.reduce(
                                  (total, loan) =>
                                    Number(total) + Number(loan.loanAmount),
                                  0
                                )}
                              </strong>
                            </td>
                            <td>
                              <strong>
                                {data.loanReports.reduce(
                                  (total, loan) =>
                                    Number(total) + Number(loan.emi),
                                  0
                                )}
                              </strong>
                            </td>
                            <td>
                              <strong>
                                {data.loanReports.reduce(
                                  (total, loan) =>
                                    Number(total) + Number(loan.outstanding),
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="col-sm-4">
                      <p>
                        <strong>Credit Report</strong>
                      </p>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Credit Card Name</th>
                            <th>Total Outstanding</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.creditReports.map((credit) => (
                            <tr key={credit.id}>
                              <td>{credit.creditCardName}</td>
                              <td>{credit.totalOutstanding}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>
                              <strong>Total</strong>
                            </td>
                            <td>
                              <strong>
                                {data.creditReports.reduce(
                                  (total, credit) =>
                                    Number(total) +
                                    Number(credit.totalOutstanding),
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
        </div>
      )
    }
    return null;
  };

  return (
    <>
      <EmployeeSidebar />
      <div className="global-container row">
        <div className="col-sm-12">
          <h2>{lead?.name || "Lead Details"}</h2>
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs">
                {["Basic Info", "activity","Loan Report"].map((tab) => (
                  <li key={tab} className="nav-item">
                    <button
                      className={`nav-link ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                      style={{ marginRight: "1rem", float: "left" }}
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
    </>
  );
};

export default LeadDetail;
