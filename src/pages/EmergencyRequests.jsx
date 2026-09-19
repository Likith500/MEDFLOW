import { useState } from "react";
import { useHospital } from "../HospitalContext";

function EmergencyRequests() {
  const {
  emergencyRequests,
  addEmergencyRequest,
  addAlert
} = useHospital();;
  const [showForm, setShowForm] = useState(false);

  const requests = emergencyRequests;

  const [form, setForm] = useState({
    resource: "ICU Beds",
    quantity: 1,
    department: "Emergency Department",
    urgency: "Critical"
  });

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function createRequest(event) {
  event.preventDefault();

  const newRequest = {
    ...form,
    quantity: Number(form.quantity)
  };

  addEmergencyRequest(newRequest);

  addAlert({
    type: form.urgency === "Critical" ? "critical" : "warning",
    title: "New Emergency Request",
    message: `${form.department} requested ${form.quantity} × ${form.resource}.`,
  });

  setShowForm(false);
}

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <p className="small-title">ACTION CENTER</p>
          <h1>Emergency Requests</h1>
          <p className="subtitle">
            Create and track urgent hospital resource requests
          </p>
        </div>

        <button
          className="primary emergency-create"
          onClick={() => setShowForm(true)}
        >
          + New Request
        </button>
      </div>

      {showForm && (
        <div className="request-form-card">

          <div className="panel-header">
            <div>
              <p className="small-title">NEW REQUEST</p>
              <h2>Request a Resource</h2>
            </div>

            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={createRequest}>

            <div className="form-grid">

              <label>
                Resource
                <select
                  name="resource"
                  value={form.resource}
                  onChange={handleChange}
                >
                  <option>ICU Beds</option>
                  <option>General Beds</option>
                  <option>Ventilators</option>
                  <option>O+ Blood</option>
                  <option>O- Blood</option>
                  <option>Platelets</option>
                </select>
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </label>

              <label>
                Department
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option>Emergency Department</option>
                  <option>ICU</option>
                  <option>General Ward</option>
                  <option>Surgery</option>
                  <option>Blood Bank</option>
                </select>
              </label>

              <label>
                Urgency
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Normal</option>
                </select>
              </label>

            </div>

            <div className="form-actions">
              <button
                type="button"
                className="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary"
              >
                Create Request
              </button>
            </div>

          </form>

        </div>
      )}

      <div className="request-list-panel">

        <div className="panel-header">
          <div>
            <p className="small-title">LIVE REQUESTS</p>
            <h2>Active Requests</h2>
          </div>

          <span className="count">
            {requests.length}
          </span>
        </div>

        {requests.map((request, index) => (

          <div className="full-request" key={index}>

            <div className="request-icon danger-bg">
              !
            </div>

            <div className="full-request-info">

              <strong>
                {request.quantity} × {request.resource}
              </strong>

              <p>
                {request.department}
              </p>

            </div>

            <span
              className={`status ${
                request.urgency === "Critical"
                  ? "critical"
                  : request.urgency === "High"
                  ? "high"
                  : "normal"
              }`}
            >
              {request.urgency}
            </span>

            <span className="request-status">
              ● {request.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default EmergencyRequests;