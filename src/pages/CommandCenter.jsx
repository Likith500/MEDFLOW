import { useState } from "react";
import { useHospital } from "../HospitalContext";

function CommandCenter() {
  const { surgeActive, emergencyRequests } = useHospital();
  const [activeAction, setActiveAction] = useState("");

  const departments = [
    { name: "Emergency", value: 92, status: "Critical" },
    { name: "ICU", value: 80, status: "High" },
    { name: "General Ward", value: 43, status: "Stable" },
    { name: "Surgery", value: 60, status: "Moderate" }
  ];

  const requests = emergencyRequests.filter(
  (request) => request.status === "Open"
);

  const handleAction = (action) => {
    setActiveAction(action);

    setTimeout(() => {
      setActiveAction("");
    }, 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="small-title">HOSPITAL OPERATIONS</p>
          <h1>Command Center</h1>
          <p className="subtitle">
            Real-time overview of hospital capacity and critical operations
          </p>
        </div>

        <div
          className={
            surgeActive
              ? "command-live surge-live"
              : "command-live"
          }
        >
          <span></span>
          {surgeActive ? "SURGE ACTIVE" : "LIVE MONITORING"}
        </div>
      </div>

      <div className="command-metrics">

        <div className="command-metric">
          <span>Available Beds</span>
          <strong>42</strong>
          <p>Across all departments</p>
        </div>

        <div className="command-metric">
          <span>ICU Beds</span>
          <strong>8</strong>
          <p>Currently available</p>
        </div>

        <div className="command-metric">
          <span>Ventilators</span>
          <strong>17</strong>
          <p>5 currently in use</p>
        </div>

        <div className="command-metric">
          <span>Open Requests</span>
          <strong>{requests.length}</strong>
          <p>Require attention</p>
        </div>

      </div>

      <div className="command-grid">

        <div className="command-panel">
          <div className="command-panel-header">
            <div>
              <p className="small-title">CAPACITY</p>
              <h2>Department Status</h2>
            </div>

            <button onClick={() => handleAction("departments")}>
              View all
            </button>
          </div>

          {departments.map((department) => (
            <div
              className="command-department"
              key={department.name}
            >
              <div className="command-department-top">
                <strong>{department.name}</strong>

                <span
                  className={
                    department.status === "Critical"
                      ? "command-status critical"
                      : department.status === "High"
                      ? "command-status high"
                      : department.status === "Moderate"
                      ? "command-status moderate"
                      : "command-status stable"
                  }
                >
                  {department.status}
                </span>
              </div>

              <div className="command-bar">
                <div
                  className="command-bar-fill"
                  style={{
                    width: `${department.value}%`
                  }}
                ></div>
              </div>

              <span className="command-percentage">
                {department.value}% occupied
              </span>
            </div>
          ))}
        </div>

        <div className="command-panel">

          <div className="command-panel-header">
            <div>
              <p className="small-title">ATTENTION REQUIRED</p>
              <h2>Emergency Requests</h2>
            </div>

            <span className="request-count">
              {requests.length} OPEN
            </span>
          </div>

          <div className="command-requests">

            {requests.map((request) => (
              <div
                className="command-request"
                key={request.id}
              >
                <div className="request-icon">
                  !
                </div>

                <div className="request-info">
                  <strong>
                    {request.quantity} × {request.resource}
                  </strong>

                  <span>
                    {request.department}
                  </span>
                </div>

                <span
                  className={
                    request.urgency === "Critical"
                      ? "request-urgency critical"
                      : "request-urgency"
                  }
                >
                  {request.urgency}
                </span>
              </div>
            ))}

          </div>

          <button
            className="command-primary-button"
            onClick={() => handleAction("matching")}
          >
            Find Resource Matches
          </button>

        </div>

      </div>

      <div className="command-actions">

        <div>
          <p className="small-title">QUICK ACTIONS</p>
          <h2>Operations</h2>
        </div>

        <div className="action-buttons">

          <button onClick={() => handleAction("surge")}>
            🚨 Activate Surge Mode
          </button>

          <button onClick={() => handleAction("request")}>
            ＋ Create Emergency Request
          </button>

          <button onClick={() => handleAction("alerts")}>
            🔔 View Live Alerts
          </button>

        </div>

      </div>

      {activeAction && (
        <div className="command-toast">

          {activeAction === "surge" &&
            "Surge Mode action selected"}

          {activeAction === "request" &&
            "Emergency Request action selected"}

          {activeAction === "alerts" &&
            "Live Alerts action selected"}

          {activeAction === "matching" &&
            "Resource Matching action selected"}

          {activeAction === "departments" &&
            "Department overview selected"}

        </div>
      )}

    </div>
  );
}

export default CommandCenter;