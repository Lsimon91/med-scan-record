
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  user_id: string;
  event_type: string;
  event_details: any;
  created_at: string;
}

const SystemEventsTable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from("system_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Eventos recientes</h2>
      {loading ? (
        <p>Cargando eventos...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm rounded">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Tipo de evento</th>
                <th>Detalles</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.user_id?.slice(0,8) || "—"}</td>
                  <td>{ev.event_type}</td>
                  <td>
                    <pre className="text-xs whitespace-pre-wrap max-w-xs">
                      {ev.event_details ? JSON.stringify(ev.event_details, null, 2) : "—"}
                    </pre>
                  </td>
                  <td>{new Date(ev.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SystemEventsTable;
