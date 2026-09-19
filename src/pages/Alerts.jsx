import { useState } from "react";

function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "ICU Capacity Critical",
      message: "ICU occupancy has reached 95%. Additional beds may be required.",
      time: "2 min ago",
      unread: true
    },
    {
      id: 2,
      type: "warning",
      title: "O- Blood Supply Low",
      message: "Blood Bank inventory is below the recommended emergency level.",
      time: "8 min ago",
      unread: true
    },
    {
      id: 3,
      type: "warning",
      title: "Emergency Requests Pending",
      message: "3 emergency resource requests are waiting for matching.",
      time: "14 min ago",
      unread: true
    },
    {
      id: 4,
      type: "success",
      title: "Ventilator Request Matched",
      message: "2 ventilators have been successfully matched to Emergency.",
      time: "21 min ago",
      unread: false
    }
  ]);

  const markAllRead = () => {
    setAlerts(
      alerts.map((alert) => ({
        ...alert,
        unread: false
      }))
    );
  };

  const unreadCount = alerts.filter((alert) => alert.unread).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="small-title">HOSPITAL MONITORING</p>
          <h1>Live Alerts</h1>
          <p className="subtitle">
            Real-time operational alerts across the hospital
          </p>
        </div>

        <div className="alert-summary">
          <span>{unreadCount}</span>
          <p>Unread Alerts</p>
        </div>
      </div>

      <div className="alerts-toolbar">
        <div>
          <strong>Operational Alerts</strong>
          <span>Monitoring hospital activity</span>
        </div>

        <button onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div
            className={`alert-card ${alert.type} ${
              alert.unread ? "unread" : ""
            }`}
            key={alert.id}
          >
            <div className="alert-icon">
              {alert.type === "critical" && "!"}
              {alert.type === "warning" && "!"}
              {alert.type === "success" && "✓"}
            </div>

            <div className="alert-content">
              <div className="alert-title-row">
                <h3>{alert.title}</h3>

                {alert.unread && (
                  <span className="new-badge">NEW</span>
                )}
              </div>

              <p>{alert.message}</p>

              <span className="alert-time">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alerts;