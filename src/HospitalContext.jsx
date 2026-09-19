import { createContext, useContext, useState } from "react";

const HospitalContext = createContext();

export function HospitalProvider({ children }) {
  const [surgeActive, setSurgeActive] = useState(false);

  const [emergencyRequests, setEmergencyRequests] = useState([
    {
      id: 1,
      resource: "ICU Beds",
      quantity: 2,
      department: "Emergency",
      urgency: "Critical",
      status: "Open"
    },
    {
      id: 2,
      resource: "O+ Blood",
      quantity: 4,
      department: "Blood Bank",
      urgency: "High",
      status: "Open"
    }
  ]);

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
    }
  ]);

  const addEmergencyRequest = (request) => {
    const newRequest = {
      id: Date.now(),
      ...request,
      status: "Open"
    };

    setEmergencyRequests((current) => [
      ...current,
      newRequest
    ]);
  };

  const addAlert = (alert) => {
    const newAlert = {
      id: Date.now(),
      time: "Just now",
      unread: true,
      ...alert
    };

    setAlerts((current) => [
      newAlert,
      ...current
    ]);
  };

  const value = {
    surgeActive,
    setSurgeActive,
    emergencyRequests,
    addEmergencyRequest,
    alerts,
    addAlert
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  return useContext(HospitalContext);
}