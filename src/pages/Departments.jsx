function Departments() {
  const departments = [
    {
      name: "Emergency",
      code: "ER",
      occupied: 92,
      beds: "92 / 100",
      status: "Critical",
      statusClass: "critical"
    },
    {
      name: "Intensive Care Unit",
      code: "ICU",
      occupied: 80,
      beds: "16 / 20",
      status: "High",
      statusClass: "high"
    },
    {
      name: "General Ward",
      code: "GW",
      occupied: 43,
      beds: "34 / 80",
      status: "Normal",
      statusClass: "normal"
    },
    {
      name: "Surgery",
      code: "SUR",
      occupied: 60,
      beds: "6 / 10",
      status: "Normal",
      statusClass: "normal"
    },
    {
      name: "Cardiology",
      code: "CARD",
      occupied: 55,
      beds: "11 / 20",
      status: "Normal",
      statusClass: "normal"
    },
    {
      name: "Pediatrics",
      code: "PED",
      occupied: 35,
      beds: "7 / 20",
      status: "Normal",
      statusClass: "normal"
    }
  ];

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <p className="small-title">HOSPITAL OPERATIONS</p>
          <h1>Departments</h1>
          <p className="subtitle">
            Current capacity and resource status across the hospital
          </p>
        </div>

        <div className="live">
          <span></span>
          LIVE DATA
        </div>
      </div>

      <div className="department-summary">

        <div className="summary-card">
          <p>Total Departments</p>
          <h2>6</h2>
        </div>

        <div className="summary-card">
          <p>Critical</p>
          <h2 className="red-number">1</h2>
        </div>

        <div className="summary-card">
          <p>High Capacity</p>
          <h2 className="orange-number">1</h2>
        </div>

        <div className="summary-card">
          <p>Normal</p>
          <h2 className="green-number">4</h2>
        </div>

      </div>

      <div className="department-grid">

        {departments.map((department) => (

          <div className="department-card" key={department.code}>

            <div className="department-card-top">

              <div className="department-symbol">
                {department.code}
              </div>

              <span className={`status ${department.statusClass}`}>
                {department.status}
              </span>

            </div>

            <h2>{department.name}</h2>

            <div className="capacity-info">
              <div>
                <span>Bed occupancy</span>
                <strong>{department.beds}</strong>
              </div>

              <strong>{department.occupied}%</strong>
            </div>

            <div className="bar">
              <div
                className={`fill ${
                  department.occupied >= 90
                    ? "danger"
                    : department.occupied >= 70
                    ? "warning-bar"
                    : "safe"
                }`}
                style={{ width: `${department.occupied}%` }}
              ></div>
            </div>

            <button className="department-button">
              View Resources →
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Departments;