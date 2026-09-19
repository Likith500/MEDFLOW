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
      to: "/resource-management",
      label: "Resource Management",
      icon: "▤"
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
            <small>{icuBeds?.inUse ?? 0} currently occupied</small>
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
            <small>{ventilators?.inUse ?? 0} currently in use</small>
          </div>

          <span className="metric-arrow">→</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            +
          </div>

          <div className="metric-content">
            <span>Blood Bank</span>
            <strong>{bloodBank?.available ?? 0}</strong>
            <small>{bloodBank?.status ?? "Unknown"} inventory</small>
          </div>

          <Link
            to="/resource-management"
            className="metric-arrow"
            aria-label="Manage Blood Bank"
          >
            →
          </Link>
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

  const openRequests = emergencyRequests.filter(
    (request) => request.status === "Open"
  );

  const [selectedRequestId, setSelectedRequestId] =
    useState(null);
  const [matched, setMatched] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const activeRequest =
    openRequests.find(
      (request) => request.id === selectedRequestId
    ) || openRequests[0] || null;

  function selectRequest(requestId) {
    setSelectedRequestId(requestId);
    setMatched(false);
    setRequestSent(false);
  }

  const matches = activeRequest
    ? [
        {
          department: "ICU",
          resource: activeRequest.resource,
          available: 8,
          distance: "0.2 km",
          score: 98,
          icon: "ICU"
        },
        {
          department: "General Ward",
          resource: activeRequest.resource,
          available: 12,
          distance: "0.5 km",
          score: 91,
          icon: "GW"
        },
        {
          department: "Surgery",
          resource: activeRequest.resource,
          available: 4,
          distance: "0.8 km",
          score: 84,
          icon: "SU"
        }
      ]
    : [];

  function handleFindMatch() {
    if (!activeRequest) {
      return;
    }

    setMatched(true);

    addAlert({
      type: "success",
      title: "Resource Match Found",
      message:
        `MEDFLOW identified available resources for ${activeRequest.quantity} × ${activeRequest.resource}.`
    });
  }

  function handleRequest(match) {
    if (!activeRequest) {
      return;
    }

    setRequestSent(true);
    matchEmergencyRequest(activeRequest.id);

    addAlert({
      type: "success",
      title: "Resource Request Matched",
      message: `${activeRequest.quantity} × ${activeRequest.resource} matched to ${match.department}.`
    });
  }

  return (
    <PageFrame
      eyebrow="RESOURCE COORDINATION"
      title="Resource Matching"
      subtitle="Find the closest available resources for open hospital requests."
    >
      <section className="matching-queue-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">OPEN REQUEST QUEUE</div>
            <h2>Requests awaiting resources</h2>
            <p>Select a request to run the match engine.</p>
          </div>

          <span className="match-count">
            {openRequests.length}
          </span>
        </div>

        {openRequests.length === 0 ? (
          <div className="empty-state matching-empty">
            <span>✓</span>
            <strong>No open requests</strong>
            <small>Create an emergency request before matching resources.</small>
          </div>
        ) : (
          <div className="matching-queue-list">
            {openRequests.map((request) => (
              <button
                type="button"
                key={request.id}
                className={
                  "matching-queue-item " +
                  (activeRequest?.id === request.id ? "selected" : "")
                }
                onClick={() => selectRequest(request.id)}
              >
                <span className="matching-queue-icon">!</span>

                <span className="matching-queue-copy">
                  <strong>
                    {request.quantity} × {request.resource}
                  </strong>
                  <small>{request.department}</small>
                </span>

                <span
                  className={`priority-pill ${
                    request.urgency?.toLowerCase() || "normal"
                  }`}
                >
                  {request.urgency}
                </span>

                <span className="matching-queue-arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {activeRequest && (
        <>
          <section className="matching-request-card">
            <div className="matching-request-icon">
              ↗
            </div>

            <div className="matching-request-main">
              <span className="eyebrow">ACTIVE REQUEST</span>
              <h2>
                {activeRequest.quantity} × {activeRequest.resource}
              </h2>
              <p>
                {activeRequest.department} • {activeRequest.urgency} priority
              </p>
            </div>

            <div className="request-state-box">
              <small>REQUEST STATUS</small>
              <strong>
                {requestSent ? "Matched" : "Awaiting match"}
              </strong>
            </div>
          </section>

          <section className="match-control-panel">
            <div>
              <div className="eyebrow">MATCH ENGINE</div>
              <h2>Find compatible resources</h2>
              <p>
                MEDFLOW checks availability, department capacity and proximity.
              </p>
            </div>

            <button
              className="primary-button large"
              onClick={handleFindMatch}
            >
              {matched ? "Matches Updated" : "Find Resource Matches"}
              <span>↗</span>
            </button>
          </section>

          {requestSent && (
            <div className="success-banner">
              <div className="success-banner-icon">✓</div>
              <div>
                <strong>Resource request successfully matched</strong>
                <span>The selected department has been notified.</span>
              </div>
            </div>
          )}

          <section className="matches-panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">AVAILABLE RESOURCES</div>
                <h2>Recommended Matches</h2>
                <p>Ranked by availability and location.</p>
              </div>

              <span className="match-count">
                {matched ? matches.length : "—"}
              </span>
            </div>

            <div className="match-list">
              {matched ? (
                matches.map((match, index) => (
                  <div
                    key={match.department}
                    className={`match-card ${
                      index === 0 ? "best-match" : ""
                    }`}
                  >
                    <div className="match-rank">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="match-icon">{match.icon}</div>

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
                      <strong>{match.score}%</strong>
                    </div>

                    <button
                      className="secondary-button compact"
                      onClick={() => handleRequest(match)}
                      disabled={requestSent}
                    >
                      {requestSent ? "Matched" : "Request"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-table matching-placeholder">
                  Click “Find Resource Matches” to generate recommendations.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </PageFrame>
  );
}

/* =========================================================
   RESOURCE MANAGEMENT
   ========================================================= */

function ResourceManagement() {
  const { resources, updateResource, addAlert } =
    useHospital();

  const [drafts, setDrafts] = useState(() =>
    resources.reduce((acc, resource) => {
      acc[resource.key] = {
        available: resource.available,
        inUse: resource.inUse
      };
      return acc;
    }, {})
  );

  const [savingKey, setSavingKey] = useState(null);
  const [savedKey, setSavedKey] = useState(null);

  function syncDrafts(nextResources) {
    setDrafts(
      nextResources.reduce((acc, resource) => {
        acc[resource.key] = {
          available: resource.available,
          inUse: resource.inUse
        };
        return acc;
      }, {})
    );
  }

  async function saveResource(resource) {
    const draft = drafts[resource.key];

    if (!draft) {
      return;
    }

    const available = Math.max(
      0,
      Number(draft.available) || 0
    );
    const inUse = Math.max(
      0,
      Number(draft.inUse) || 0
    );

    setSavingKey(resource.key);
    setSavedKey(null);

    const updated = await updateResource(
      resource.key,
      { available, inUse }
    );

    setSavingKey(null);

    if (!updated) {
      return;
    }

    setSavedKey(resource.key);

    addAlert({
      type: "success",
      title: "Resource Inventory Updated",
      message: `${resource.label}: ${available} available, ${inUse} in use.`
    });

    window.setTimeout(() => {
      setSavedKey((current) =>
        current === resource.key ? null : current
      );
    }, 1800);
  }

  return (
    <PageFrame
      eyebrow="RESOURCE OPERATIONS"
      title="Resource Management"
      subtitle="Update live inventory and watch operational changes propagate across MEDFLOW."
      action={
        <div className="command-live">
          <span />
          Live inventory
        </div>
      }
    >
      <section className="resource-management-banner">
        <div>
          <div className="eyebrow">
            CONTROL PANEL
          </div>

          <h2>Hospital resource inventory</h2>

          <p>
            Changes are saved to Supabase and synchronized
            in real time across open MEDFLOW sessions.
          </p>
        </div>

        <button
          className="secondary-button compact"
          onClick={() => syncDrafts(resources)}
        >
          Reset edits
        </button>
      </section>

      <section className="resource-management-grid">
        {resources.map((resource) => {
          const draft =
            drafts[resource.key] || {
              available: resource.available,
              inUse: resource.inUse
            };

          const changed =
            Number(draft.available) !== resource.available ||
            Number(draft.inUse) !== resource.inUse;

          return (
            <article
              className="resource-management-card"
              key={resource.key}
            >
              <div className="resource-management-top">
                <div>
                  <span className="eyebrow">
                    INVENTORY
                  </span>
                  <h2>{resource.label}</h2>
                </div>

                <span
                  className={
                    resource.status === "Low"
                      ? "status-pill critical"
                      : "status-pill stable"
                  }
                >
                  {resource.status}
                </span>
              </div>

              <div className="resource-live-number">
                <strong>{resource.available}</strong>
                <span>available now</span>
              </div>

              <div className="resource-input-grid">
                <label>
                  Available
                  <input
                    type="number"
                    min="0"
                    value={draft.available}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [resource.key]: {
                          ...current[resource.key],
                          available: event.target.value
                        }
                      }))
                    }
                  />
                </label>

                <label>
                  In use
                  <input
                    type="number"
                    min="0"
                    value={draft.inUse}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [resource.key]: {
                          ...current[resource.key],
                          inUse: event.target.value
                        }
                      }))
                    }
                  />
                </label>
              </div>

              <div className="resource-management-footer">
                <small>{resource.detail}</small>

                <button
                  className={
                    changed
                      ? "primary-button compact"
                      : "secondary-button compact"
                  }
                  onClick={() => saveResource(resource)}
                  disabled={savingKey === resource.key || !changed}
                >
                  {savingKey === resource.key
                    ? "Saving..."
                    : savedKey === resource.key
                    ? "Saved ✓"
                    : changed
                    ? "Save changes"
                    : "Up to date"}
                </button>
              </div>
            </article>
          );
        })}
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
    addAlert,
    departments,
    resources,
    emergencyRequests
  } = useHospital();

  const criticalRequests = emergencyRequests.filter(
    (request) => request.status === "Open" &&
      request.urgency === "Critical"
  ).length;

  const availableBeds = resources.find(
    (resource) => resource.key === "available_beds"
  );
  const responseTeams = resources.find(
    (resource) => resource.key === "response_teams"
  );

  function toggleSurge() {
    const next = !surgeActive;

    setSurgeActive(next);

    addAlert({
      type: next ? "critical" : "success",
      title: next
        ? "SURGE RESPONSE ACTIVATED"
        : "Surge Mode Deactivated",
      message: next
        ? "Hospital operations have entered coordinated surge protocols."
        : "Hospital operations have returned to standard capacity."
    });
  }

  const readiness = departments.map((department) => ({
    title: department.name,
    percentage: Math.round(
      (department.capacityOccupied /
        department.capacityTotal) *
        100
    ),
    available:
      department.capacityTotal -
      department.capacityOccupied,
    unit: department.capacityUnit,
    status: department.status,
    type: department.status.toLowerCase()
  }));

  return (
    <PageFrame
      eyebrow="INCIDENT RESPONSE"
      title="Surge Mode"
      subtitle="Hospital-wide escalation controls for periods of sustained capacity pressure."
      action={
        <div
          className={
            "surge-status-badge " +
            (surgeActive ? "on" : "off")
          }
        >
          <span />
          {surgeActive
            ? "INCIDENT ACTIVE"
            : "STANDARD OPERATIONS"}
        </div>
      }
    >
      <section
        className={
          "surge-incident-panel " +
          (surgeActive ? "active" : "")
        }
      >
        <div className="surge-incident-mark">
          !
        </div>

        <div className="surge-incident-copy">
          <div className="eyebrow">
            {surgeActive
              ? "HIGH PRIORITY • RESPONSE IN PROGRESS"
              : "ESCALATION CONTROL"}
          </div>

          <h2>
            {surgeActive
              ? "Hospital surge response is active"
              : "Surge response is on standby"}
          </h2>

          <p>
            {surgeActive
              ? "Priority resources, staffing and transfer capacity should be coordinated across all monitored units."
              : "Activate only when normal operating capacity is no longer sufficient for current hospital demand."}
          </p>
        </div>

        <button
          className={
            "surge-command-button " +
            (surgeActive ? "active" : "")
          }
          onClick={toggleSurge}
        >
          <span className="surge-command-kicker">
            {surgeActive ? "RESPONSE CONTROL" : "EMERGENCY CONTROL"}
          </span>
          <strong>
            {surgeActive
              ? "DEACTIVATE SURGE"
              : "ACTIVATE SURGE"}
          </strong>
          <small>
            {surgeActive
              ? "Return to standard operations"
              : "Escalate hospital coordination"}
          </small>
        </button>
      </section>

      <section className="surge-live-strip">
        <div>
          <span className="surge-live-label">LIVE INCIDENT STATE</span>
          <strong>
            {surgeActive
              ? "SURGE RESPONSE ACTIVE"
              : "NO ACTIVE SURGE"}
          </strong>
        </div>

        <div>
          <span>Open critical requests</span>
          <strong>{criticalRequests}</strong>
        </div>

        <div>
          <span>Available beds</span>
          <strong>{availableBeds?.available ?? 0}</strong>
        </div>

        <div>
          <span>Response teams</span>
          <strong>{responseTeams?.available ?? 7}</strong>
        </div>

        <div className="surge-live-time">
          <span>Protocol</span>
          <strong>
            {surgeActive ? "Escalated" : "Standby"}
          </strong>
        </div>
      </section>

      <section className="surge-metric-grid">
        <div className="surge-metric">
          <span>Priority Units</span>
          <strong>
            {departments.filter(
              (department) =>
                department.status === "Critical" ||
                department.status === "High"
            ).length}
          </strong>
          <small>High-utilization departments</small>
        </div>

        <div className="surge-metric">
          <span>Available Beds</span>
          <strong>{availableBeds?.available ?? 0}</strong>
          <small>Hospital-wide availability</small>
        </div>

        <div className="surge-metric">
          <span>Open Requests</span>
          <strong>
            {emergencyRequests.filter(
              (request) => request.status === "Open"
            ).length}
          </strong>
          <small>Awaiting resource coordination</small>
        </div>

        <div className="surge-metric">
          <span>Critical Requests</span>
          <strong>{criticalRequests}</strong>
          <small>Immediate attention required</small>
        </div>
      </section>

      <section className="readiness-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">
              INCIDENT READINESS
            </div>
            <h2>Department capacity pressure</h2>
            <p>
              Current occupancy used to determine response pressure.
            </p>
          </div>

          <span className="live-pill">
            <span />
            LIVE
          </span>
        </div>

        <div className="readiness-grid">
          {readiness.map((department) => (
            <div
              className={
                "readiness-card " +
                (department.percentage >= 80
                  ? "pressure"
                  : "")
              }
              key={department.title}
            >
              <div className="readiness-top">
                <div>
                  <strong>{department.title}</strong>
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
                  className={
                    "readiness-fill " +
                    department.type
                  }
                  style={{
                    width:
                      department.percentage + "%"
                  }}
                />
              </div>

              <div className="readiness-footer">
                <span>Available</span>
                <strong>
                  {department.available}{" "}
                  {department.unit}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surge-protocol-panel">
        <div className="surge-protocol-head">
          <div>
            <div className="eyebrow">
              RESPONSE PROTOCOL
            </div>
            <h2>Escalation checklist</h2>
          </div>

          <span
            className={
              surgeActive
                ? "protocol-state active"
                : "protocol-state"
            }
          >
            {surgeActive
              ? "IN PROGRESS"
              : "READY"}
          </span>
        </div>

        <div className="surge-protocol-steps">
          <div className="surge-step done">
            <span>01</span>
            <div>
              <strong>Staffing coverage</strong>
              <small>Confirm priority unit coverage</small>
            </div>
          </div>

          <div className="surge-step done">
            <span>02</span>
            <div>
              <strong>Bed capacity</strong>
              <small>Reserve available beds for escalation</small>
            </div>
          </div>

          <div className="surge-step">
            <span>03</span>
            <div>
              <strong>Transfer coordination</strong>
              <small>Prepare transport and receiving capacity</small>
            </div>
          </div>

          <div className="surge-step">
            <span>04</span>
            <div>
              <strong>Operations broadcast</strong>
              <small>Notify active hospital teams</small>
            </div>
          </div>
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
          path="/resource-management"
          element={<ResourceManagement />}
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