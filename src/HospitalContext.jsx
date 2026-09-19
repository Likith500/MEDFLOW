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


const initialResources = [
  { key: "available_beds", label: "Available Beds", available: 42, inUse: 0, status: "Normal", detail: "Across all departments" },
  { key: "icu_beds", label: "ICU Beds", available: 8, inUse: 12, status: "Normal", detail: "Currently available" },
  { key: "ventilators", label: "Ventilators", available: 17, inUse: 5, status: "Normal", detail: "5 currently in use" },
  { key: "ambulances", label: "Ambulances", available: 4, inUse: 0, status: "Normal", detail: "Available for deployment" },
  { key: "blood_bank", label: "Blood Bank", available: 0, inUse: 0, status: "Low", detail: "Emergency inventory level" }
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
  const [resources, setResources] = useState(initialResources);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("MEDFLOW TEST: HospitalContext is running");

    async function loadHospitalData() {
      try {
        const [
          emergencyRequestsResult,
          alertsResult,
          departmentsResult,
          resourcesResult
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
            .order("id", { ascending: true }),
          supabase
            .from("hospital_resources")
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

        if (resourcesResult.error) {
          throw resourcesResult.error;
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

        setResources(
          (resourcesResult.data || []).map((resource) => ({
            key: resource.resource_key,
            label: resource.label,
            available: resource.available,
            inUse: resource.in_use,
            status: resource.status,
            detail: resource.detail
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


  async function updateResource(resourceKey, changes) {
    const dbChanges = {
      available: Number(changes.available),
      in_use: Number(changes.inUse)
    };

    console.log("MEDFLOW: updating resource", {
      resourceKey,
      dbChanges
    });

    const { error: updateError } = await supabase
      .from("hospital_resources")
      .update(dbChanges)
      .eq("resource_key", resourceKey);

    if (updateError) {
      console.error(
        "MEDFLOW: resource UPDATE failed:",
        JSON.stringify({
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        })
      );
      return null;
    }

    const { data, error: readError } = await supabase
      .from("hospital_resources")
      .select("*")
      .eq("resource_key", resourceKey)
      .single();

    if (readError) {
      console.error(
        "MEDFLOW: resource read-back failed:",
        JSON.stringify({
          message: readError.message,
          details: readError.details,
          hint: readError.hint,
          code: readError.code
        })
      );
      return null;
    }

    const updatedResource = {
      key: data.resource_key,
      label: data.label,
      available: data.available,
      inUse: data.in_use,
      status: data.status,
      detail: data.detail
    };

    setResources((current) =>
      current.map((resource) =>
        resource.key === resourceKey
          ? updatedResource
          : resource
      )
    );

    console.log(
      "MEDFLOW: resource saved successfully:",
      updatedResource
    );

    return updatedResource;
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

  useEffect(() => {
    const emergencyChannel = supabase
      .channel("medflow-realtime-emergency")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "emergency_requests"
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEmergencyRequests((current) => {
              const exists = current.some(
                (request) => request.id === payload.new.id
              );
              return exists
                ? current
                : [payload.new, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            setEmergencyRequests((current) =>
              current.map((request) =>
                request.id === payload.new.id
                  ? payload.new
                  : request
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setEmergencyRequests((current) =>
              current.filter(
                (request) => request.id !== payload.old.id
              )
            );
          }
        }
      )
      .subscribe();

    const alertsChannel = supabase
      .channel("medflow-realtime-alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alerts"
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setAlerts((current) => {
              const exists = current.some(
                (alert) => alert.id === payload.new.id
              );
              return exists
                ? current
                : [payload.new, ...current];
            });
          }

          if (payload.eventType === "UPDATE") {
            setAlerts((current) =>
              current.map((alert) =>
                alert.id === payload.new.id
                  ? payload.new
                  : alert
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setAlerts((current) =>
              current.filter(
                (alert) => alert.id !== payload.old.id
              )
            );
          }
        }
      )
      .subscribe();

    const departmentsChannel = supabase
      .channel("medflow-realtime-departments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "departments"
        },
        (payload) => {
          const mapDepartment = (department) => ({
            id: department.id,
            name: department.name,
            short: department.short_code,
            status: department.status,
            capacityTotal: department.capacity_total,
            capacityOccupied: department.capacity_occupied,
            patients: department.active_patients,
            capacityUnit: department.capacity_unit
          });

          if (payload.eventType === "INSERT") {
            setDepartments((current) => [
              ...current,
              mapDepartment(payload.new)
            ]);
          }

          if (payload.eventType === "UPDATE") {
            setDepartments((current) =>
              current.map((department) =>
                department.id === payload.new.id
                  ? mapDepartment(payload.new)
                  : department
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setDepartments((current) =>
              current.filter(
                (department) => department.id !== payload.old.id
              )
            );
          }
        }
      )
      .subscribe();

    const resourcesChannel = supabase
      .channel("medflow-realtime-resources")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hospital_resources"
        },
        (payload) => {
          const mapResource = (resource) => ({
            key: resource.resource_key,
            label: resource.label,
            available: resource.available,
            inUse: resource.in_use,
            status: resource.status,
            detail: resource.detail
          });

          if (payload.eventType === "INSERT") {
            setResources((current) => [
              ...current,
              mapResource(payload.new)
            ]);
          }

          if (payload.eventType === "UPDATE") {
            setResources((current) =>
              current.map((resource) =>
                resource.key === payload.new.resource_key
                  ? mapResource(payload.new)
                  : resource
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setResources((current) =>
              current.filter(
                (resource) =>
                  resource.key !== payload.old.resource_key
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(departmentsChannel);
      supabase.removeChannel(resourcesChannel);
    };
  }, []);

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
    resources,
    updateResource,
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
