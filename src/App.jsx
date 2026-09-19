import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link
} from "react-router-dom";

import { useHospital } from "./HospitalContext";

/* =========================================================
   MEDFLOW LOGO
   Blue + teal interlocking flow mark matching the reference
   ========================================================= */

function MedflowLogo({ large = false }) {
  return (
    <svg
      className={`medflow-logo ${large ? "large" : ""}`}
      viewBox="0 0 64 64"
      aria-label="MEDFLOW"
    >
      {/* BLUE FLOW BAR */}
      <path
        d="M11 18
           C11 13 15 10 20 10
           H29
           V20
           H21
           C19 20 18 21 18 23
           V27
           H29
           V35
           H20
           C15 35 11 31 11 26
           Z"
        fill="#238BE0"
      />

      {/* TEAL FLOW BAR */}
      <path
        d="M53 46
           C53 51 49 54 44 54
           H35
           V44
           H43
           C45 44 46 43 46 41
           V37
           H35
           V29
           H44
           C49 29 53 33 53 38
           Z"
        fill="#19B39D"
      />

      {/* CENTRAL MEDICAL FLOW CONNECTION */}
      <path
        d="M20 31
           C27 31 30 20 38 20
           C43 20 46 24 46 29"
        fill="none"
        stroke="#238BE0"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M44 33
           C37 33 34 44 26 44
           C21 44 18 40 18 35"
        fill="none"
        stroke="#19B39D"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* WHITE CUT THROUGH THE CENTER */}
      <path
        d="M26 32
           C29 32 31 28 34 27
           C37 26 39 28 40 31"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   SHARED SIDEBAR
   ========================================================= */

function Sidebar() {
  const { emergencyRequests, alerts } = useHospital();

  const openRequests = emergencyRequests.filter(
    (request) => request.status === "Open"
  ).length;

  const unreadAlerts = alerts.filter((alert) => alert.unread).length;

  const navigation = [
    {
      to: "/",
      label: "Dashboard",
      icon: "▦",
      end: true
    },
    {
      to: "/departments",
      label: "Departments",
      icon: "⊞"
    },
    {
      to: "/emergency-requests",
      label: "Emergency Requests",
      icon: "!"
    },
    {
      to: "/resource-matching",
      label: "Resource Matching",
      icon: "↗"
    },
    {
      to: "/surge-mode",
      label: "Surge Mode",
      icon: "ϟ"
    },
    {
      to: "/alerts",
      label: "Live Alerts",
      icon: "◌"
    },
    {
      to: "/command-center",
      label: "Command Center",
      icon: "◎"
    }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <MedflowLogo />

        <div className="brand-copy">
          <div className="brand-name">
            MED<span>FLOW</span>
          </div>

          <div className="brand-subtitle">
            Resources, connected. Care, coordinate.
          </div>
        </div>
      </div>

      <div className="sidebar-line" />

      <div className="sidebar-section-title">OPERATIONS</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>

            <span className="nav-text">
              {item.label}
            </span>

            {item.label === "Emergency Requests" &&
              openRequests > 0 && (
                <span className="nav-badge">
                  {openRequests}
                </span>
              )}

            {item.label === "Live Alerts" &&
              unreadAlerts > 0 && (
                <span className="nav-badge">
                  {unreadAlerts}
                </span>
              )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-card">
          <span className="system-dot" />

          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   SHARED TOP BAR
   ========================================================= */

function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Search departments, resources, or requests..."
          aria-label="Search"
        />
      </div>

      <div className="topbar-right">
        <div className="top-live">
          <span />
          Live
        </div>

        <div className="top-status">
          <small>HOSPITAL STATUS</small>
          <strong>Operational</strong>
        </div>

        <div className="date-block">
          <small>OPERATIONS</small>
          <strong>24 / 7</strong>
        </div>

        <div className="profile">
          SA
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   SHARED PAGE FRAME
   ========================================================= */

function PageFrame({
  eyebrow,
  title,
  subtitle,
  action,
  children
}) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <div className="page-body">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>

            {action && (
              <div className="page-heading-action">
                {action}
              </div>
            )}
          </section>

          {children}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  const { emergencyRequests, departments, resources } = useHospital();

  const openRequests = emergencyRequests.filter(
    (request) => request.status === "Open"
  );

  const visibleDepartments = departments.slice(0, 4);

  const availableBeds = resources.find(
    (resource) => resource.key === "available_beds"
  );
  const icuBeds = resources.find(
    (resource) => resource.key === "icu_beds"
  );
  const ventilators = resources.find(
    (resource) => resource.key === "ventilators"
  );
  const ambulances = resources.find(
    (resource) => resource.key === "ambulances"
  );
  const bloodBank = resources.find(
    (resource) => resource.key === "blood_bank"
  );

  return (
    <PageFrame
      eyebrow="HOSPITAL OPERATIONS"
      title="Hospital Dashboard"
      subtitle="Real-time resource coordination across the hospital."
      action={
        <div className="heading-status">
          <span />
          System operational
        </div>
      }
    >
      <section className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon">
            ▥
          </div>

          <div className="metric-content">
            <span>Available Beds</span>
            <strong>{availableBeds?.available ?? 0}</strong>
            <small>Across all departments</small>
          </div>

          <span className="metric-arrow">→</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            □
          </div>

          <div className="metric-content">
            <span>ICU Beds</span>
            <strong>{icuBeds?.available ?? 0}</strong>
            <small>Currently available</small>
          </div>

          <span className="metric-arrow">→</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon blue">
            ◉
          </div>

          <div className="metric-content">
            <span>Ventilators</span>
            <strong>{ventilators?.available ?? 0}</strong>
            <small>{ventilators?.detail ?? "Currently tracked"}</small>
          </div>

          <span className="metric-arrow">→</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon teal">
            !
          </div>

          <div className="metric-content">
            <span>Open Requests</span>
            <strong>{openRequests.length}</strong>
            <small>Require attention</small>
          </div>

          <span className="metric-arrow">→</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">
                HOSPITAL CAPACITY
              </div>

              <h2>Department Status</h2>
              <p>Live occupancy across departments</p>
            </div>

            <Link
              to="/departments"
              className="text-link"
            >
              View all departments →
            </Link>
          </div>

          <div className="capacity-list">
            {visibleDepartments.map((department) => (
              <div
                className="capacity-row"
                key={department.name}
              >
                <div className="capacity-name">
                  <span
                    className={"capacity-dot " + department.status.toLowerCase()}
                  />

                  <div>
                    <strong>
                      {department.name}
                    </strong>

                    <small>
                      {department.status}
                    </small>
                  </div>
                </div>

                <div className="capacity-bar">
                  <div
                    className={"capacity-fill " + department.status.toLowerCase()}
                    style={{
                      width: Math.round((department.capacityOccupied / department.capacityTotal) * 100) + "%"
                    }}
                  />
                </div>

                <div className="capacity-number">
                  <strong>
                    {Math.round((department.capacityOccupied / department.capacityTotal) * 100)}%
                  </strong>

                  <small>
                    {department.capacityOccupied} / {department.capacityTotal}
                  </small>
                </div>
              </div>
            ))}
          </div>

          <div className="overview-strip">
            <div className="overview-title">
              <div className="overview-icon">+</div>

              <div>
                <strong>Hospital Overview</strong>
                <small>
                  Key resources and current status
                </small>
              </div>
            </div>

            <div className="overview-item">
              <span className="overview-dot warning" />

              <div>
                <small>Blood Bank</small>
                <strong>{bloodBank?.status ?? "Unknown"}</strong>
              </div>
            </div>

            <div className="overview-item">
              <span className="overview-dot safe" />

              <div>
                <small>Ventilators</small>
                <strong>{ventilators?.status ?? "Unknown"}</strong>
              </div>
            </div>

            <div className="overview-item">
              <span className="overview-dot safe" />

              <div>
                <small>Ambulances</small>
                <strong>{ambulances?.available ?? 0} available</strong>
              </div>
            </div>

            <div className="overview-item">
              <span className="overview-dot safe" />

              <div>
                <small>Surge Status</small>
                <strong>Off</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">
                ACTION CENTER
              </div>

              <h2>Emergency Requests</h2>

              <p>
                Open requests requiring resources
              </p>
            </div>

            <span className="request-count">
              {openRequests.length}
            </span>
          </div>

          <div className="request-list">
            {openRequests.length === 0 ? (
              <div className="empty-state">
                <span>✓</span>
                <strong>No open requests</strong>
                <small>
                  All emergency requests are handled.
                </small>
              </div>
            ) : (
              openRequests.slice(0, 5).map((request) => (
                <div
                  className="dashboard-request"
                  key={request.id}
                >
                  <div className="request-symbol">
                    !
                  </div>

                  <div className="request-copy">
                    <strong>
                      {request.quantity} ×{" "}
                      {request.resource}
                    </strong>

                    <small>
                      {request.department}
                    </small>
                  </div>

                  <div
                    className={`urgency ${
                      request.urgency?.toLowerCase() ||
                      "normal"
                    }`}
                  >
                    {request.urgency}
                  </div>

                  <span className="request-arrow">
                    →
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            to="/resource-matching"
            className="matching-button"
          >
            Find Resource Matches
            <span>→</span>
          </Link>
        </div>
      </section>

      <div className="dashboard-footer">
        <div className="footer-mark">
          <MedflowLogo />
        </div>

        <div>
          <strong>
            Everything you need, when you need it.
          </strong>

          <span>
            MEDFLOW connects resources, teams and
            departments so your hospital can move faster.
          </span>
        </div>

        <div className="footer-status">
          <span />
          Live operations
        </div>
      </div>
    </PageFrame>
  );
}

/* =========================================================
   DEPARTMENTS
   ========================================================= */

function Departments() {
  const { departments } = useHospital();

  const totalDepartments = departments.length;
  const totalCapacity = departments.reduce(
    (sum, department) => sum + department.capacityTotal,
    0
  );
  const occupiedCapacity = departments.reduce(
    (sum, department) => sum + department.capacityOccupied,
    0
  );
  const availableCapacity = totalCapacity - occupiedCapacity;

  return (
    <PageFrame
      eyebrow="HOSPITAL CAPACITY"
      title="Departments"
      subtitle="Monitor capacity, occupancy and readiness across hospital units."
    >
      <section className="summary-grid">
        <div className="summary-card"><span>Total Departments</span><strong>{totalDepartments}</strong><small>Currently monitored</small></div>
        <div className="summary-card"><span>Total Capacity</span><strong>{totalCapacity}</strong><small>Across all units</small></div>
        <div className="summary-card"><span>Occupied</span><strong>{occupiedCapacity}</strong><small>Current utilization</small></div>
        <div className="summary-card"><span>Available</span><strong className="teal-number">{availableCapacity}</strong><small>Ready for allocation</small></div>
      </section>

      <section className="department-grid">
        {departments.map((department) => {
          const percentage = Math.round((department.capacityOccupied / department.capacityTotal) * 100);
          const available = department.capacityTotal - department.capacityOccupied;

          return (
            <article className="department-card" key={department.id}>
              <div className="department-card-top">
                <div className="department-symbol">{department.short}</div>
                <span className={"status-pill " + department.status.toLowerCase()}>{department.status}</span>
              </div>
              <h2>{department.name}</h2>
              <div className="department-stat-line"><span>Occupancy</span><strong>{percentage}%</strong></div>
              <div className="big-capacity-bar">
                <div className={"big-capacity-fill " + department.status.toLowerCase()} style={{ width: percentage + "%" }} />
              </div>
              <div className="department-details">
                <div><small>Occupied</small><strong>{department.capacityOccupied} / {department.capacityTotal}</strong></div>
                <div><small>Available</small><strong>{available} {department.capacityUnit}</strong></div>
                <div><small>Active</small><strong>{department.patients}</strong></div>
              </div>
              <button className="secondary-button">View Department <span>→</span></button>
            </article>
          );
        })}
      </section>
    </PageFrame>
  );
}

/* =========================================================
   EMERGENCY REQUESTS
   ========================================================= */

function EmergencyRequests() {
  const {
    emergencyRequests,
    addEmergencyRequest,
    addAlert
  } = useHospital();

  const [showForm, setShowForm] =
    useState(false);

  const [filter, setFilter] =
    useState("All");

  const [form, setForm] = useState({
    department: "Emergency",
    resource: "ICU Beds",
    quantity: 1,
    urgency: "Critical"
  });

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function createRequest(event) {
    event.preventDefault();

    const newRequest = {
      ...form,
      quantity: Number(form.quantity)
    };

    addEmergencyRequest(newRequest);

    addAlert({
      type:
        form.urgency === "Critical"
          ? "critical"
          : "warning",
      title: "New Emergency Request",
      message: `${form.department} requested ${form.quantity} × ${form.resource}.`
    });

    setShowForm(false);

    setForm({
      department: "Emergency",
      resource: "ICU Beds",
      quantity: 1,
      urgency: "Critical"
    });
  }

  const visibleRequests =
    filter === "All"
      ? emergencyRequests
      : emergencyRequests.filter(
          (request) => request.status === filter
        );

  return (
    <PageFrame
      eyebrow="ACTION CENTER"
      title="Emergency Requests"
      subtitle="Create, monitor and coordinate hospital resource requests."
      action={
        <button
          className="primary-button"
          onClick={() => setShowForm((value) => !value)}
        >
          + Create Emergency Request
        </button>
      }
    >
      <section className="request-summary-grid">
        <div className="request-summary critical-summary">
          <span className="summary-mini-icon">!</span>

          <div>
            <small>Critical</small>
            <strong>
              {
                emergencyRequests.filter(
                  (r) => r.urgency === "Critical"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="request-summary">
          <span className="summary-mini-icon">
            !
          </span>

          <div>
            <small>Open</small>
            <strong>
              {
                emergencyRequests.filter(
                  (r) => r.status === "Open"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="request-summary">
          <span className="summary-mini-icon">
            ✓
          </span>

          <div>
            <small>Matched</small>
            <strong>
              {
                emergencyRequests.filter(
                  (r) => r.status !== "Open"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="request-summary">
          <span className="summary-mini-icon">
            ↗
          </span>

          <div>
            <small>Total Requests</small>
            <strong>
              {emergencyRequests.length}
            </strong>
          </div>
        </div>
      </section>

      {showForm && (
        <section className="request-form-panel">
          <div className="form-panel-heading">
            <div>
              <div className="eyebrow">
                NEW REQUEST
              </div>

              <h2>Request hospital resources</h2>

              <p>
                Submit a request to the live coordination queue.
              </p>
            </div>

            <button
              className="icon-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={createRequest}>
            <div className="form-grid">
              <label>
                Department
                <select
                  name="department"
                  value={form.department}
                  onChange={updateForm}
                >
                  <option>Emergency</option>
                  <option>ICU</option>
                  <option>General Ward</option>
                  <option>Surgery</option>
                  <option>Radiology</option>
                  <option>Pediatrics</option>
                </select>
              </label>

              <label>
                Resource
                <select
                  name="resource"
                  value={form.resource}
                  onChange={updateForm}
                >
                  <option>ICU Beds</option>
                  <option>Ventilator</option>
                  <option>General Beds</option>
                  <option>Blood Units</option>
                  <option>Transport Team</option>
                  <option>Operating Room</option>
                </select>
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={updateForm}
                />
              </label>

              <label>
                Urgency
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={updateForm}
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
                className="secondary-button compact"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Create Request
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="queue-panel">
        <div className="queue-heading">
          <div>
            <div className="eyebrow">
              LIVE QUEUE
            </div>

            <h2>Resource Requests</h2>
            <p>
              Active and completed coordination requests.
            </p>
          </div>

          <div className="filter-group">
            {["All", "Open", "Matched"].map(
              (option) => (
                <button
                  key={option}
                  className={
                    filter === option
                      ? "filter active"
                      : "filter"
                  }
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>

        <div className="request-table">
          <div className="request-table-header">
            <span>REQUEST</span>
            <span>DEPARTMENT</span>
            <span>PRIORITY</span>
            <span>STATUS</span>
            <span />
          </div>

          {visibleRequests.map((request) => (
            <div
              className="request-table-row"
              key={request.id}
            >
              <div className="request-cell-main">
                <div className="table-icon">
                  !
                </div>

                <div>
                  <strong>
                    {request.quantity} ×{" "}
                    {request.resource}
                  </strong>

                  <small>
                    Resource allocation required
                  </small>
                </div>
              </div>

              <span className="table-muted">
                {request.department}
              </span>

              <span
                className={`priority-pill ${
                  request.urgency?.toLowerCase() ||
                  "normal"
                }`}
              >
                {request.urgency}
              </span>

              <span
                className={`status-pill table-status ${
                  request.status === "Open"
                    ? "open"
                    : "matched"
                }`}
              >
                {request.status}
              </span>

              <span className="row-arrow">
                →
              </span>
            </div>
          ))}

          {visibleRequests.length === 0 && (
            <div className="empty-table">
              No requests in this view.
            </div>
          )}
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   RESOURCE MATCHING
   ========================================================= */

function ResourceMatching() {
  const {
    emergencyRequests,
    addAlert,
    matchEmergencyRequest
  } = useHospital();

  const [matched, setMatched] =
    useState(false);

  const [requestSent, setRequestSent] =
    useState(false);

  const activeRequest =
    emergencyRequests.find(
      (request) => request.status === "Open"
    ) || emergencyRequests[0];

  const matches = [
    {
      department: "ICU",
      resource: activeRequest?.resource || "ICU Beds",
      available: 8,
      distance: "0.2 km",
      score: 98,
      icon: "ICU"
    },
    {
      department: "General Ward",
      resource:
        activeRequest?.resource || "General Beds",
      available: 12,
      distance: "0.5 km",
      score: 91,
      icon: "GW"
    },
    {
      department: "Surgery",
      resource:
        activeRequest?.resource || "Ventilator",
      available: 4,
      distance: "0.8 km",
      score: 84,
      icon: "SU"
    }
  ];

  function handleFindMatch() {
    setMatched(true);

    addAlert({
      type: "success",
      title: "Resource Match Found",
      message:
        "MEDFLOW identified available resources across hospital departments."
    });
  }

  function handleRequest(match) {
    setRequestSent(true);

    if (activeRequest?.id) {
      matchEmergencyRequest(activeRequest.id);
    }

    addAlert({
      type: "success",
      title: "Resource Request Matched",
      message: `${activeRequest?.quantity || 1} × ${
        activeRequest?.resource || "resource"
      } matched to ${match.department}.`
    });
  }

  return (
    <PageFrame
      eyebrow="RESOURCE COORDINATION"
      title="Resource Matching"
      subtitle="Find the closest available resources for open hospital requests."
    >
      <section className="matching-request-card">
        <div className="matching-request-icon">
          ↗
        </div>

        <div className="matching-request-main">
          <span className="eyebrow">
            ACTIVE REQUEST
          </span>

          <h2>
            {activeRequest?.quantity || 1} ×{" "}
            {activeRequest?.resource || "ICU Beds"}
          </h2>

          <p>
            {activeRequest?.department ||
              "Emergency"}{" "}
            •{" "}
            {activeRequest?.urgency ||
              "Critical"}{" "}
            priority
          </p>
        </div>

        <div className="request-state-box">
          <small>REQUEST STATUS</small>
          <strong>
            {requestSent
              ? "Matched"
              : "Awaiting match"}
          </strong>
        </div>
      </section>

      <section className="match-control-panel">
        <div>
          <div className="eyebrow">
            MATCH ENGINE
          </div>

          <h2>
            Find compatible resources
          </h2>

          <p>
            MEDFLOW checks availability, department capacity
            and proximity.
          </p>
        </div>

        <button
          className="primary-button large"
          onClick={handleFindMatch}
        >
          {matched
            ? "Matches Updated"
            : "Find Resource Matches"}
          <span>↗</span>
        </button>
      </section>

      {requestSent && (
        <div className="success-banner">
          <div className="success-banner-icon">
            ✓
          </div>

          <div>
            <strong>
              Resource request successfully matched
            </strong>

            <span>
              The selected department has been notified.
            </span>
          </div>
        </div>
      )}

      <section className="matches-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">
              AVAILABLE RESOURCES
            </div>

            <h2>Recommended Matches</h2>

            <p>
              Ranked by availability and location.
            </p>
          </div>

          <span className="match-count">
            {matched ? matches.length : "—"}
          </span>
        </div>

        <div className="match-list">
          {matches.map((match, index) => (
            <div
              key={match.department}
              className={`match-card ${
                index === 0 ? "best-match" : ""
              }`}
            >
              <div className="match-rank">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="match-icon">
                {match.icon}
              </div>

              <div className="match-main">
                <strong>{match.department}</strong>

                <p>{match.resource}</p>
              </div>

              <div className="match-detail">
                <small>Available</small>
                <strong>{match.available}</strong>
              </div>

              <div className="match-detail">
                <small>Distance</small>
                <strong>{match.distance}</strong>
              </div>

              <div className="match-score">
                <small>Match</small>
                <strong>
                  {match.score}%
                </strong>
              </div>

              <button
                className="secondary-button compact"
                onClick={() =>
                  handleRequest(match)
                }
                disabled={requestSent}
              >
                {requestSent
                  ? "Matched"
                  : "Request"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   SURGE MODE
   ========================================================= */

function SurgeMode() {
  const {
    surgeActive,
    setSurgeActive,
    addAlert
  } = useHospital();

  function toggleSurge() {
    const next = !surgeActive;

    setSurgeActive(next);

    addAlert({
      type: next ? "critical" : "success",
      title: next
        ? "Surge Mode Activated"
        : "Surge Mode Deactivated",
      message: next
        ? "Hospital operations are now running under surge protocols."
        : "Hospital operations have returned to standard capacity."
    });
  }

  const readiness = [
    {
      title: "Emergency",
      percentage: 92,
      beds: "2 available",
      status: "Critical",
      type: "critical"
    },
    {
      title: "ICU",
      percentage: 80,
      beds: "4 available",
      status: "High",
      type: "high"
    },
    {
      title: "General Ward",
      percentage: 43,
      beds: "46 available",
      status: "Stable",
      type: "stable"
    },
    {
      title: "Surgery",
      percentage: 60,
      beds: "12 available",
      status: "Moderate",
      type: "moderate"
    }
  ];

  return (
    <PageFrame
      eyebrow="SURGE RESPONSE"
      title="Surge Mode"
      subtitle="Activate coordinated hospital response when demand spikes."
      action={
        <div
          className={`surge-status-badge ${
            surgeActive ? "on" : "off"
          }`}
        >
          <span />
          {surgeActive
            ? "Surge active"
            : "Standard operations"}
        </div>
      }
    >
      <section
        className={`surge-control-panel ${
          surgeActive ? "active" : ""
        }`}
      >
        <div className="surge-control-copy">
          <div className="eyebrow">
            RESPONSE CONTROL
          </div>

          <h2>
            {surgeActive
              ? "Surge Mode is active"
              : "Surge Mode is ready"}
          </h2>

          <p>
            {surgeActive
              ? "Priority resources are being coordinated across departments."
              : "Activate when hospital demand requires expanded coordination."}
          </p>
        </div>

        <button
          className={`surge-toggle ${
            surgeActive ? "active" : ""
          }`}
          onClick={toggleSurge}
          aria-label="Toggle surge mode"
        >
          <span className="toggle-track">
            <span className="toggle-knob" />
          </span>

          <strong>
            {surgeActive ? "ACTIVE" : "OFF"}
          </strong>
        </button>
      </section>

      <section className="surge-metric-grid">
        <div className="surge-metric">
          <span>Priority Units</span>
          <strong>4</strong>
          <small>Under enhanced monitoring</small>
        </div>

        <div className="surge-metric">
          <span>Available Beds</span>
          <strong>42</strong>
          <small>Across hospital</small>
        </div>

        <div className="surge-metric">
          <span>Response Teams</span>
          <strong>7</strong>
          <small>Ready for deployment</small>
        </div>

        <div className="surge-metric">
          <span>Critical Requests</span>
          <strong>3</strong>
          <small>Need immediate attention</small>
        </div>
      </section>

      <section className="readiness-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">
              SURGE READINESS
            </div>

            <h2>Department capacity</h2>
            <p>Live operational readiness.</p>
          </div>
        </div>

        <div className="readiness-grid">
          {readiness.map((department) => (
            <div
              className="readiness-card"
              key={department.title}
            >
              <div className="readiness-top">
                <div>
                  <strong>
                    {department.title}
                  </strong>

                  <small>
                    {department.status}
                  </small>
                </div>

                <strong>
                  {department.percentage}%
                </strong>
              </div>

              <div className="readiness-bar">
                <div
                  className={`readiness-fill ${department.type}`}
                  style={{
                    width: `${department.percentage}%`
                  }}
                />
              </div>

              <div className="readiness-footer">
                <span>Occupancy</span>
                <strong>
                  {department.beds}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="protocol-panel">
        <div className="protocol-icon">ϟ</div>

        <div>
          <strong>Surge protocol checklist</strong>

          <p>
            Confirm staffing coverage, reserve critical
            resources and coordinate transfer capacity.
          </p>
        </div>

        <div className="protocol-items">
          <span className="complete">✓ Staffing</span>
          <span className="complete">✓ Beds</span>
          <span>○ Transport</span>
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   ALERTS
   ========================================================= */

function Alerts() {
  const { alerts, setAlerts } =
    useHospital();

  const unreadCount = alerts.filter(
    (alert) => alert.unread
  ).length;

  function markAllRead() {
    setAlerts(
      alerts.map((alert) => ({
        ...alert,
        unread: false
      }))
    );
  }

  return (
    <PageFrame
      eyebrow="LIVE MONITORING"
      title="Live Alerts"
      subtitle="Real-time operational events from across the hospital."
      action={
        <button
          className="secondary-button"
          onClick={markAllRead}
        >
          Mark all as read
        </button>
      }
    >
      <section className="alert-overview-grid">
        <div className="alert-overview-card">
          <div className="alert-overview-icon">
            !
          </div>

          <div>
            <small>Unread Alerts</small>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="alert-overview-card">
          <div className="alert-overview-icon blue">
            ◌
          </div>

          <div>
            <small>Total Events</small>
            <strong>{alerts.length}</strong>
          </div>
        </div>

        <div className="alert-overview-card">
          <div className="alert-overview-icon teal">
            ✓
          </div>

          <div>
            <small>System State</small>
            <strong>Operational</strong>
          </div>
        </div>
      </section>

      <section className="alerts-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">
              EVENT STREAM
            </div>

            <h2>Operational timeline</h2>
            <p>
              Newest events appear at the top.
            </p>
          </div>

          <span className="live-pill">
            <span />
            LIVE
          </span>
        </div>

        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="empty-state">
              <span>✓</span>
              <strong>No active alerts</strong>
              <small>
                Hospital operations are clear.
              </small>
            </div>
          ) : (
            alerts.map((alert) => (
              <article
                key={alert.id}
                className={`alert-item ${
                  alert.unread ? "unread" : ""
                }`}
              >
                <div
                  className={`alert-icon-box ${
                    alert.type || "warning"
                  }`}
                >
                  {alert.type === "success"
                    ? "✓"
                    : alert.type === "critical"
                    ? "!"
                    : "◌"}
                </div>

                <div className="alert-content">
                  <div className="alert-title-row">
                    <strong>
                      {alert.title}
                    </strong>

                    {alert.unread && (
                      <span className="new-tag">
                        NEW
                      </span>
                    )}
                  </div>

                  <p>{alert.message}</p>

                  <small>
                    Hospital operations • Just now
                  </small>
                </div>

                <span className="alert-side-arrow">
                  →
                </span>
              </article>
            ))
          )}
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   COMMAND CENTER
   ========================================================= */

function CommandCenter() {
  const {
    emergencyRequests,
    alerts,
    surgeActive,
    setSurgeActive,
    addAlert,
    resources
  } = useHospital();

  const openRequests = emergencyRequests.filter(
    (request) => request.status === "Open"
  );

  const unreadAlerts = alerts.filter(
    (alert) => alert.unread
  ).length;

  const availableBeds = resources.find(
    (resource) => resource.key === "available_beds"
  );
  const icuBeds = resources.find(
    (resource) => resource.key === "icu_beds"
  );
  const ventilators = resources.find(
    (resource) => resource.key === "ventilators"
  );

  function runAction(action) {
    if (action === "surge") {
      setSurgeActive(true);

      addAlert({
        type: "critical",
        title: "Surge Mode Activated",
        message:
          "Command Center initiated surge response."
      });
    }

    if (action === "broadcast") {
      addAlert({
        type: "warning",
        title: "Operations Broadcast Sent",
        message:
          "Hospital teams received a priority operations update."
      });
    }
  }

  return (
    <PageFrame
      eyebrow="COMMAND & CONTROL"
      title="Command Center"
      subtitle="Real-time overview of hospital capacity and critical operations."
      action={
        <div className="command-live">
          <span />
          Live command feed
        </div>
      }
    >
      <section className="command-metrics">
        <div className="command-metric">
          <span>Available Beds</span>
          <strong>{availableBeds?.available ?? 0}</strong>
          <small>Across all departments</small>
        </div>

        <div className="command-metric">
          <span>ICU Beds</span>
          <strong>{icuBeds?.available ?? 0}</strong>
          <small>Currently available</small>
        </div>

        <div className="command-metric">
          <span>Ventilators</span>
          <strong>{ventilators?.available ?? 0}</strong>
          <small>{ventilators?.detail ?? "Currently tracked"}</small>
        </div>

        <div className="command-metric">
          <span>Open Requests</span>
          <strong>{openRequests.length}</strong>
          <small>{unreadAlerts} unread alerts</small>
        </div>
      </section>

      <section className="command-grid">
        <div className="command-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">
                CAPACITY CONTROL
              </div>

              <h2>Hospital readiness</h2>
            </div>
          </div>

          <div className="command-department-list">
            {[
              ["Emergency", 92],
              ["ICU", 80],
              ["General Ward", 43],
              ["Surgery", 60]
            ].map(([name, percentage]) => (
              <div
                className="command-department"
                key={name}
              >
                <div>
                  <strong>{name}</strong>
                  <small>
                    {percentage >= 80
                      ? "High utilization"
                      : "Normal utilization"}
                  </small>
                </div>

                <div className="command-bar">
                  <div
                    className="command-bar-fill"
                    style={{
                      width: `${percentage}%`
                    }}
                  />
                </div>

                <strong>
                  {percentage}%
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="command-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">
                PRIORITY QUEUE
              </div>

              <h2>Open requests</h2>
            </div>

            <Link
              to="/emergency-requests"
              className="text-link"
            >
              View all →
            </Link>
          </div>

          <div className="command-request-list">
            {openRequests.slice(0, 5).map(
              (request) => (
                <div
                  className="command-request"
                  key={request.id}
                >
                  <div className="table-icon">
                    !
                  </div>

                  <div>
                    <strong>
                      {request.quantity} ×{" "}
                      {request.resource}
                    </strong>

                    <small>
                      {request.department}
                    </small>
                  </div>

                  <span
                    className={`priority-pill ${
                      request.urgency?.toLowerCase() ||
                      "normal"
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>
              )
            )}

            {openRequests.length === 0 && (
              <div className="empty-state compact-empty">
                <span>✓</span>
                <strong>Queue clear</strong>
                <small>
                  No open requests.
                </small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="command-actions-panel">
        <div>
          <div className="eyebrow">
            QUICK ACTIONS
          </div>

          <h2>Operations controls</h2>

          <p>
            Execute common coordination actions without leaving
            the command center.
          </p>
        </div>

        <div className="command-actions">
          <button
            className="command-action-card"
            onClick={() => runAction("surge")}
          >
            <span>ϟ</span>
            <div>
              <strong>
                {surgeActive
                  ? "Surge Mode Active"
                  : "Activate Surge"}
              </strong>

              <small>
                Coordinate hospital-wide response
              </small>
            </div>
          </button>

          <button
            className="command-action-card"
            onClick={() => runAction("broadcast")}
          >
            <span>◌</span>

            <div>
              <strong>
                Broadcast Update
              </strong>

              <small>
                Notify active hospital teams
              </small>
            </div>
          </button>

          <Link
            to="/resource-matching"
            className="command-action-card"
          >
            <span>↗</span>

            <div>
              <strong>
                Open Resource Matching
              </strong>

              <small>
                Find available resources
              </small>
            </div>
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   ROUTER
   ========================================================= */

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/departments"
          element={<Departments />}
        />

        <Route
          path="/emergency-requests"
          element={<EmergencyRequests />}
        />

        <Route
          path="/resource-matching"
          element={<ResourceMatching />}
        />

        <Route
          path="/surge-mode"
          element={<SurgeMode />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />

        <Route
          path="/command-center"
          element={<CommandCenter />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;