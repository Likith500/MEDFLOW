import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { supabase } from "./lib/supabaseClient";

const HospitalContext = createContext();

const initialEmergencyRequests = [
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
];

const initialAlerts = [
  {
    id: 1,
    type: "critical",
    title: "ICU Capacity Critical",
    message:
      "ICU occupancy has reached 95%. Additional beds may be required.",
    time: "2 min ago",
    unread: true
  },
  {
    id: 2,
    type: "warning",
    title: "O- Blood Supply Low",
    message:
      "Blood Bank inventory is below the recommended emergency level.",
    time: "8 min ago",
    unread: true
  }
];

export function HospitalProvider({ children }) {
  const [surgeActive, setSurgeActive] = useState(false);
  const [emergencyRequests, setEmergencyRequests] = useState(
    initialEmergencyRequests
  );
  const [alerts, setAlerts] = useState(initialAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("MEDFLOW TEST: HospitalContext is running");

    async function loadHospitalData() {
      try {
        const [
          emergencyRequestsResult,
          alertsResult
        ] = await Promise.all([
          supabase
            .from("emergency_requests")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("alerts")
            .select("*")
            .order("created_at", { ascending: false })
        ]);

        if (emergencyRequestsResult.error) {
          throw emergencyRequestsResult.error;
        }

        if (alertsResult.error) {
          throw alertsResult.error;
        }

        setEmergencyRequests(
          emergencyRequestsResult.data || []
        );
        setAlerts(alertsResult.data || []);

        console.log("MEDFLOW connected to Supabase.");
      } catch (error) {
        console.error(
          "Supabase connection failed:",
          error
        );
        console.log(
          "MEDFLOW is using local fallback data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHospitalData();
  }, []);

  async function addEmergencyRequest(request) {
    const newRequest = {
      resource: request.resource,
      quantity: Number(request.quantity),
      department: request.department,
      urgency: request.urgency,
      status: "Open"
    };

    const { data, error } = await supabase
      .from("emergency_requests")
      .insert([newRequest])
      .select()
      .single();

    if (error) {
      console.error(
        "Could not create emergency request:",
        error
      );
      return null;
    }

    setEmergencyRequests((current) => [
      data,
      ...current
    ]);

    return data;
  }

  async function matchEmergencyRequest(requestId) {
    const { error } = await supabase
      .from("emergency_requests")
      .update({ status: "Matched" })
      .eq("id", requestId);

    if (error) {
      console.error(
        "Could not match emergency request:",
        error
      );
      return;
    }

    setEmergencyRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? { ...request, status: "Matched" }
          : request
      )
    );
  }

  async function addAlert(alert) {
    const newAlert = {
      type: alert.type || "warning",
      title: alert.title,
      message: alert.message,
      time: "Just now",
      unread: true
    };

    const { data, error } = await supabase
      .from("alerts")
      .insert([newAlert])
      .select()
      .single();

    if (error) {
      console.error(
        "Could not create alert:",
        error
      );
      return null;
    }

    setAlerts((current) => [
      data,
      ...current
    ]);

    return data;
  }

  async function setAlertsAndPersist(nextAlerts) {
    setAlerts(nextAlerts);

    const readAlerts = nextAlerts.filter(
      (alert) => alert.unread === false
    );

    await Promise.all(
      readAlerts.map(async (alert) => {
        await supabase
          .from("alerts")
          .update({ unread: false })
          .eq("id", alert.id);
      })
    );
  }

  const value = {
    surgeActive,
    setSurgeActive,
    emergencyRequests,
    addEmergencyRequest,
    matchEmergencyRequest,
    alerts,
    setAlerts: setAlertsAndPersist,
    addAlert,
    loading
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
