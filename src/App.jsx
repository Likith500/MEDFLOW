import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Departments from "./pages/Departments";
import EmergencyRequests from "./pages/EmergencyRequests";
import ResourceMatching from "./pages/ResourceMatching";
import SurgeMode from "./pages/SurgeMode";

function App() {
  return (
    <div className="app">

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">+</div>
          <div>
            <h2>MEDFLOW</h2>
            <p>Hospital Operations</p>
          </div>
        </div>

        <nav>
  <Link to="/" className="active">Dashboard</Link>

  <Link to="/departments">Departments</Link>

  <Link to="/emergency-requests">Emergency Requests</Link>

  <Link to="/resource-matching">
  Resource Matching
</Link>
<Link to="/surge-mode">
  🚨 Surge Mode
</Link>

  <button>Analytics</button>
</nav>

        <div className="hospital-status">
          <span></span>
          Hospital system online
        </div>
      </aside>

      <main className="main">

        <header>
          <div>
            <p className="small-title">LIVE OVERVIEW</p>
            <h1>Hospital Dashboard</h1>
            <p className="subtitle">
              Real-time resource coordination
            </p>
          </div>

          <div className="header-right">
            <div className="live">
              <span></span>
              LIVE
            </div>
            <div className="profile">SA</div>
          </div>
        </header>

        <section className="alert">
          <div className="alert-icon">!</div>
          <div>
            <strong>Emergency department approaching capacity</strong>
            <p>
              Current occupancy is 92%. Consider preparing additional beds.
            </p>
          </div>
          <button>View Details →</button>
        </section>

        <section className="cards">

          <div className="card">
            <div className="card-top">
              <span>Available Beds</span>
              <span className="icon">+</span>
            </div>
            <h2>24</h2>
            <p className="positive">↑ 4 available today</p>
          </div>

          <div className="card">
            <div className="card-top">
              <span>ICU Beds</span>
              <span className="icon">♥</span>
            </div>
            <h2>4</h2>
            <p className="warning">Only 1 available in Block A</p>
          </div>

          <div className="card">
            <div className="card-top">
              <span>Ventilators</span>
              <span className="icon">◉</span>
            </div>
            <h2>7</h2>
            <p className="positive">3 currently in use</p>
          </div>

          <div className="card">
            <div className="card-top">
              <span>Blood Supply</span>
              <span className="icon">●</span>
            </div>
            <h2>Normal</h2>
            <p className="positive">All critical groups available</p>
          </div>

        </section>

        <section className="content-grid">

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="small-title">HOSPITAL CAPACITY</p>
                <h2>Department Status</h2>
              </div>
              <button className="outline">View All</button>
            </div>

            <div className="department">
              <div>
                <strong>Emergency</strong>
                <p>92 / 100 occupied</p>
              </div>
              <div className="bar">
                <div className="fill danger" style={{width: "92%"}}></div>
              </div>
              <b>92%</b>
            </div>

            <div className="department">
              <div>
                <strong>ICU</strong>
                <p>16 / 20 occupied</p>
              </div>
              <div className="bar">
                <div className="fill warning-bar" style={{width: "80%"}}></div>
              </div>
              <b>80%</b>
            </div>

            <div className="department">
              <div>
                <strong>General Ward</strong>
                <p>34 / 80 occupied</p>
              </div>
              <div className="bar">
                <div className="fill safe" style={{width: "43%"}}></div>
              </div>
              <b>43%</b>
            </div>

            <div className="department">
              <div>
                <strong>Surgery</strong>
                <p>6 / 10 occupied</p>
              </div>
              <div className="bar">
                <div className="fill warning-bar" style={{width: "60%"}}></div>
              </div>
              <b>60%</b>
            </div>

          </div>

          <div className="panel emergency-panel">

            <div className="panel-header">
              <div>
                <p className="small-title">ACTION CENTER</p>
                <h2>Emergency Requests</h2>
              </div>
              <span className="count">3</span>
            </div>

            <div className="request">
              <div className="request-icon danger-bg">!</div>
              <div>
                <strong>2 ICU beds needed</strong>
                <p>Emergency Department · Critical</p>
              </div>
                <span className="status critical">Urgent</span>
            </div>

            <div className="request">
              <div className="request-icon warning-bg">+</div>
              <div>
                <strong>O+ blood required</strong>
                <p>Blood Bank · High</p>
              </div>
              <span className="status high">High</span>
            </div>

            <div className="request">
              <div className="request-icon normal-bg">✓</div>
              <div>
                <strong>3 beds requested</strong>
                <p>General Ward · Normal</p>
              </div>
              <span className="status normal">Open</span>
            </div>

            <button className="primary">
              + Create Emergency Request
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />} />

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

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
