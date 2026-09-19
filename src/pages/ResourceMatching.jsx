import { useState } from "react";

function ResourceMatching() {
  const [matched, setMatched] = useState(false);

  const matches = [
    {
      department: "ICU Block B",
      resource: "ICU Beds",
      available: 2,
      distance: "180 m",
      status: "Available",
      score: "98%"
    },
    {
      department: "ICU Block A",
      resource: "ICU Beds",
      available: 1,
      distance: "320 m",
      status: "Limited",
      score: "76%"
    },
    {
      department: "General Ward",
      resource: "ICU Beds",
      available: 0,
      distance: "240 m",
      status: "Unavailable",
      score: "32%"
    }
  ];

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <p className="small-title">RESOURCE COORDINATION</p>

          <h1>Resource Matching</h1>

          <p className="subtitle">
            Find available resources across hospital departments
          </p>
        </div>

        <div className="live">
          <span></span>
          MATCHING SYSTEM ONLINE
        </div>
      </div>


      {/* REQUEST */}

      <div className="matching-request">

        <div className="request-info">

          <div className="request-icon danger-bg">
            !
          </div>

          <div>
            <p className="small-title">
              ACTIVE REQUEST
            </p>

            <h2>
              2 × ICU Beds
            </h2>

            <p>
              Emergency Department · Critical priority
            </p>
          </div>

        </div>

        <div className="request-meta">

          <span className="status critical">
            Critical
          </span>

          <span>
            Requested 2 min ago
          </span>

        </div>

      </div>


      {/* MATCH BUTTON */}

      <div className="matching-action">

        {!matched ? (

          <button
            className="primary match-button"
            onClick={() => setMatched(true)}
          >
            🔎 Find Best Match
          </button>

        ) : (

          <div className="matching-found">
            ✓ Best resource match found
          </div>

        )}

      </div>


      {/* RESULTS */}

      <div className="request-list-panel">

        <div className="panel-header">

          <div>
            <p className="small-title">
              MATCH RESULTS
            </p>

            <h2>
              Available Resources
            </h2>
          </div>

          <span className="count">
            {matches.length}
          </span>

        </div>


        {matches.map((match, index) => (

          <div
            className={`match-card ${
              index === 0 && matched
                ? "best-match"
                : ""
            }`}
            key={match.department}
          >

            <div className="match-icon">
              🏥
            </div>


            <div className="match-main">

              <strong>
                {match.department}
              </strong>

              <p>
                {match.resource}
              </p>

            </div>


            <div className="match-detail">

              <span>
                Available
              </span>

              <strong>
                {match.available}
              </strong>

            </div>


            <div className="match-detail">

              <span>
                Distance
              </span>

              <strong>
                {match.distance}
              </strong>

            </div>


            <div className="match-score">

              <span>
                Match
              </span>

              <strong>
                {match.score}
              </strong>

            </div>


            <span
              className={`status ${
                match.status === "Available"
                  ? "normal"
                  : match.status === "Limited"
                  ? "high"
                  : "critical"
              }`}
            >
              {match.status}
            </span>


            {match.status === "Available" && (

              <button
                className="accept-button"
                onClick={() => alert(
                  `Resource request sent to ${match.department}`
                )}
              >
                Request
              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default ResourceMatching;