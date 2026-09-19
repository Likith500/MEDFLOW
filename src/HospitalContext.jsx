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

const initialDepartments = [
  { id: 1, name: "Emergency", short: "ER", status: "Critical", capacityTotal: 25, capacityOccupied: 23, patients: 37, capacityUnit: "beds" },
  { id: 2, name: "ICU", short: "ICU", status: "High", capacityTotal: 20, capacityOccupied: 16, patients: 16, capacityUnit: "beds" },
  { id: 3, name: "General Ward", short: "GW", status: "Stable", capacityTotal: 80, capacityOccupied: 34, patients: 34, capacityUnit: "beds" },
  { id: 4, name: "Surgery", short: "SU", status: "Moderate", capacityTotal: 30, capacityOccupied: 18, patients: 18, capacityUnit: "beds" },
  { id: 5, name: "Radiology", short: "RA", status: "Stable", capacityTotal: 12, capacityOccupied: 5, patients: 9, capacityUnit: "rooms" },
  { id: 6, name: "Pediatrics", short: "PD", status: "Stable", capacityTotal: 24, capacityOccupied: 11, patients: 11, capacityUnit: "beds" }
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
  const [departments, setDepartments] = useState(initialDepartments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("MEDFLOW TEST: HospitalContext is running");

    async function loadHospitalData() {
      try {
        const [
          emergencyRequestsResult,
          alertsResult,
          departmentsResult
        ] = await Promise.all([
          supabase
            .from("emergency_requests")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("alerts")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("departments")
            .select("*")
            .order("id", { ascending: true })
        ]);

        if (emergencyRequestsResult.error) {
          throw emergencyRequestsResult.error;
        }

        if (alertsResult.error) {
          throw alertsResult.error;
        }

        if (departmentsResult.error) {
          throw departmentsResult.error;
        }

        setEmergencyRequests(
          emergencyRequestsResult.data || []
        );
        setAlerts(alertsResult.data || []);

        setDepartments(
          (departmentsResult.data || []).map((department) => ({
            id: department.id,
            name: department.name,
            short: department.short_code,
            status: department.status,
            capacityTotal: department.capacity_total,
            capacityOccupied: department.capacity_occupied,
            patients: department.active_patients,
            capacityUnit: department.capacity_unit
          }))
        );

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
    departments,
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
