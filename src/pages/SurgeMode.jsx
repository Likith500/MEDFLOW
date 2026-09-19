import { useHospital } from "../HospitalContext";

function SurgeMode() {
  const { surgeActive, setSurgeActive } = useHospital();

  const departments = [
    {
      name: "Emergency",
      normal: 92,
      surge: 100
    },
    {
      name: "ICU",
      normal: 80,
      surge: 95
    },
    {
      name: "General Ward",
      normal: 43,
      surge: 72
    },
    {
      name: "Surgery",
      normal: 60,
      surge: 88
    }
  ];

  return (
    <div className="page">

      <div className="page-header">

        <div>
          <p className="small-title">
            EMERGENCY OPERATIONS
          </p>

          <h1>Surge Mode</h1>

          <p className="subtitle">
            Prepare hospital resources for a sudden increase in demand
          </p>
        </div>

        <div className="surge-status">
          <span className={surgeActive ? "surge-dot active" : "surge-dot"}></span>

          {surgeActive ? "SURGE ACTIVE" : "NORMAL OPERATIONS"}
        </div>

      </div>


      {/* CONTROL PANEL */}

      <div className={`surge-control ${surgeActive ? "surge-active" : ""}`}>

        <div className="surge-control-content">

          <div className="surge-symbol">
            🚨
          </div>

          <div>

            <p className="small-title">
              CAPACITY CONTROL
            </p>

            <h2>
              {surgeActive
                ? "Emergency Surge Activated"
                : "Hospital Operating Normally"}
            </h2>

            <p>
              {surgeActive
                ? "MEDFLOW is prioritizing emergency resources and monitoring capacity."
                : "Activate Surge Mode when a sudden increase in patient demand occurs."}
            </p>

          </div>

        </div>


        <button
          className={surgeActive ? "deactivate-surge" : "activate-surge"}
          onClick={() => setSurgeActive(!surgeActive)}
        >
          {surgeActive
            ? "Deactivate Surge"
            : "Activate Surge Mode"}
        </button>

      </div>


      {/* IMPACT CARDS */}

      <div className="surge-cards">

        <div className="surge-card">

          <span>Emergency Patients</span>

          <strong>
            {surgeActive ? "47" : "18"}
          </strong>

          <p>
            {surgeActive
              ? "↑ 161% increase"
              : "Current average"}
          </p>

        </div>


        <div className="surge-card">

          <span>ICU Demand</span>

          <strong>
            {surgeActive ? "19" : "8"}
          </strong>

          <p>
            {surgeActive
              ? "11 additional beds needed"
              : "Current demand"}
          </p>

        </div>


        <div className="surge-card">

          <span>Ventilators</span>

          <strong>
            {surgeActive ? "12" : "5"}
          </strong>

          <p>
            {surgeActive
              ? "7 additional units needed"
              : "Current usage"}
          </p>

        </div>


        <div className="surge-card">

          <span>Blood Supply</span>

          <strong>
            {surgeActive ? "Low" : "Normal"}
          </strong>

          <p>
            {surgeActive
              ? "O+ and O- require attention"
              : "All critical groups available"}
          </p>

        </div>

      </div>


      {/* DEPARTMENT IMPACT */}

      <div className="request-list-panel">

        <div className="panel-header">

          <div>

            <p className="small-title">
              CAPACITY IMPACT
            </p>

            <h2>
              Department Pressure
            </h2>

          </div>

          {surgeActive && (
            <span className="status critical">
              HIGH PRESSURE
            </span>
          )}

        </div>


        {departments.map((department) => {

          const percentage = surgeActive
            ? department.surge
            : department.normal;

          return (

            <div
              className="surge-department"
              key={department.name}
            >

              <div className="surge-department-name">

                <strong>
                  {department.name}
                </strong>

                <span>
                  {percentage}% occupied
                </span>

              </div>


              <div className="bar">

                <div
                  className={`fill ${
                    percentage >= 90
                      ? "danger"
                      : percentage >= 70
                      ? "warning-bar"
                      : "safe"
                  }`}
                  style={{
                    width: `${percentage}%`
                  }}
                ></div>

              </div>


              <strong>
                {percentage}%
              </strong>

            </div>

          );

        })}

      </div>


      {/* RECOMMENDATIONS */}

      {surgeActive && (

        <div className="surge-recommendations">

          <div>

            <p className="small-title">
              MEDFLOW RECOMMENDATIONS
            </p>

            <h2>
              Immediate Actions
            </h2>

          </div>


          <div className="recommendation">

            <span>1</span>

            <div>
              <strong>
                Locate 11 ICU beds
              </strong>

              <p>
                Start Resource Matching across available departments.
              </p>
            </div>

          </div>


          <div className="recommendation">

            <span>2</span>

            <div>
              <strong>
                Locate 7 ventilators
              </strong>

              <p>
                Check equipment availability across the hospital.
              </p>
            </div>

          </div>


          <div className="recommendation">

            <span>3</span>

            <div>
              <strong>
                Monitor blood supply
              </strong>

              <p>
                Prioritize O+ and O- inventory.
              </p>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default SurgeMode;